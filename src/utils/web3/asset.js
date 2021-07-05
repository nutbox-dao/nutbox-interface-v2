import {
  getContract,
  getAbi,
  contractAddress
} from "./contract";
import store from '@/store'
import {
  Contract,
  ethers,
  utils
} from "ethers";
import {
  getProvider
} from './ethers'
import {
  Transaction_config
} from '@/config'

/**
 * Judge asset wheather Homechain assets
 * @param {String} address regitsry contract address address 
 */
const isHomeChainAsset = (address) => {
  return address === contractAddress['HomeChainAssetRegistry']
}
/**
 * Judge asset wheather SteemHive assets
 * @param {String} address regitsry contract address address 
 */
const isSteemHiveAsset = (address) => {
  return address === contractAddress['SteemHiveDelegateAssetRegistry']
}
/**
 * Judge asset wheather Crowdloan assets
 * @param {String} address regitsry contract address address 
 */
const isCrowdloanAsset = (address) => {
  return address === contractAddress['SubstrateCrowdloanAssetRegistry']
}
/**
 * Judge asset wheather Nominate assets
 * @param {String} address regitsry contract address address 
 */
const isNominateAsset = (address) => {
  return address === contractAddress['SubstrateNominateAssetRegistry']
}
/**
 * 获取资产类型
 * @param {*} address 
 * @returns 
 */
const assetType = (address) => {
  for (let contract in contractAddress){
    if (contractAddress[contract].toLowerCase() === address.toLowerCase()){
      return contract
    }
  }
}

/**
 * Get regisryAssets of user
 * Restore these infos to cache
 * @returns assets list contains detail infos
 */
export const getRegitryAssets = async (update=false) => {
  let assets = store.state.web3.allAssetsOfUser
  if (!update && assets){
    return assets
  }
  const account = store.state.web3.account
  const contract = await getContract('RegistryHub');
  if (!contract) return;
  const assetCount = await contract.registryCounter(account);
  assets = await Promise.all((new Array(assetCount).toString().split(',').map((item, i) => contract.registryHub(account, i))))
  const registryContract = await Promise.all(assets.map(asset => contract.getRegistryContract(asset)))
  assets = assets.map((asset, index) => ({
    asset,
    contract: registryContract[index],
    type: assetType(registryContract[index])
  }));
  const metadatas = await Promise.all(assets.map(asset => getForeignChainMetadata(asset.asset, asset.type)))
  
  assets = assets.map((asset, index) => ({
    ...asset,
    metadata: metadatas[index]
  }))
  store.commit('web3/saveAllAssetsOfUser', assets)
  return assets
}

/**
 * get foreignchain asset meta data
 * @param {String} id asset id 
 * @param {String} assetType asset contract address
 */
export const getForeignChainMetadata = async (id, assetType) => {
  const contract = await getContract(assetType === 'HomeChainAssetRegistry' ? 'RegistryHub' : assetType)
  if (!contract) return;
  if (assetType === 'HomeChainAssetRegistry'){
    const homeLocation = await contract.getHomeLocation(id)
    return await getERC20Info(homeLocation)
  }
  const meta = await contract.idToMetadata(id)
  return meta
}

// get ERC20 info from home chain.
// TODO:  Change to get info from our server
export const getERC20Info = async (address) => {
  const contract = await getContract('ERC20', address);
  if (!contract) return;
  let infos = await Promise.all([contract.name(), contract.symbol()])
  return {name: infos[0], symbol: infos[1], address}
}

/**
 * registry homechain asset
 * @param {*} assetAddress
 */
export const registryHomeChainAsset = async (assetAddress) => {
  // validate asset address

  // regitster asset
  const contract = await getContract('HomeChainAssetRegistry');
  await contract.registerAsset(
    '0x', assetAddress, '0x',
    Transaction_config
  )
}

/**
 * Depoly ERC20 token
 * @param {*} param0
 * @param {Bool} isMintalbel  
 * @returns
 */
export const deployERC20 = async ({
  name,
  symbol,
  decimal,
  totalSupply
}, isMintalbel) => {
  try {
    const abi = await getAbi(isMintalbel ? 'MintableERC20' : "SimpleERC20")
    const eth = await getProvider()
    const factory = new ethers.ContractFactory(abi.abi, abi.bytecode, eth.getSigner())
    const contract = await factory.deploy(name, symbol, ethers.utils.parseUnits(totalSupply, decimal), store.state.web3.account,
      Transaction_config)
    await contract.deployed()
    return contract.address
  } catch (e) {
    console.log(`Deploy mintable token ${name} failed`, e);
    return null
  }
}
