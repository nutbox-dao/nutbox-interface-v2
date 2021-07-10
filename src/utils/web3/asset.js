import {
  getContract,
  getAbi,
  contractAddress
} from "./contract";
import store from '@/store'
import {
  ethers
} from "ethers";
import {
  getWeb3
} from './web3'
import {
  getProvider,
  waitForTx
} from './ethers'
import {
  Transaction_config
} from '@/config'
import { getAllTokens } from '@/apis/api'

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
  const metadatas = await Promise.all(assets.map(asset => getAssetMetadata(asset.asset, asset.type)))
  
  assets = assets.map((asset, index) => ({
    ...asset,
    ...metadatas[index]
  }))
  store.commit('web3/saveAllAssetsOfUser', assets)
  return assets
}

/**
 * get asset meta data
 * @param {String} id asset id 
 * @param {String} assetType asset contract address
 */
export const getAssetMetadata = async (id, assetType) => {
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
export const getERC20Info = async (address) => {
  const contract = await getContract('ERC20', address);
  if (!contract) return;
  const tokens = await getAllTokenFromBackend()
  let infos = await Promise.all([contract.name(), contract.symbol(), contract.decimals()])
  const tokenFromBackend = tokens?.filter(token => token.address === address)
  let icon = null
  if (tokenFromBackend && tokenFromBackend.length > 0){
    icon = tokenFromBackend[0].icon
  }
  return {name: infos[0], symbol: infos[1], decimal: infos[2], address, icon}
}

/**
 * register homechain asset
 * @param {*} assetAddress
 */
export const registerHomeChainAsset = async (assetAddress) => {
  // validate asset address

  // regitster asset
  const contract = await getContract('HomeChainAssetRegistry');
  if (!contract) return
  try{
    const tx = await contract.registerAsset(
      '0x', assetAddress, '0x',
      Transaction_config
    )
    return tx
  }catch(e) {
    console.log('Registry Homechain Asset Fail', e);
  }
}

/**
 * Register steem/hive bind asset
 * @param {*} form 
 */
export const registerSteemHiveAsset = async (form) => {
  const contract = await getContract('SteemHiveDelegateAssetRegistry');
  if (!contract) return;
  try{
    const web3 = await getWeb3()
    const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20)
    const foreignLocation = '0x' +
    ethers.utils.hexZeroPad(ethers.utils.hexlify(form.chainId), 1).substr(2) + 
    web3.utils.stringToHex(form.chainId === 1 ? 'sp' : 'hp').substr(2) + 
    ethers.utils.hexZeroPad(ethers.utils.hexlify(form.account.length), 4).substr(2) + 
    web3.utils.stringToHex(form.account).substr(2)
    const tx = await contract.registerAsset(
      foreignLocation, homeChain, web3.utils.stringToHex(form.assetName),
      Transaction_config
    )
    await waitForTx(tx.hash)
    return tx.hash
  }catch(e){
    throw(e)
  }
}

/**
 * Depoly ERC20 token
 * @param {*} param0 token object
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

/**
 * Get all tokens from nutbox backend
 * Will store data to cache
 * @param {*} update  wheather update local cache
 * @returns 
 */
export const getAllTokenFromBackend = async (update=false) => {
  const tokens = store.state.web3.allTokens
  if (!update && tokens) {
    return tokens
  }
  try{
    const allTokens = await getAllTokens()
    store.commit('web3/saveAllTokens', allTokens)
    return allTokens
  }catch(e){
    console.log('Get All Tokens Failed');
    return null
  }
  
}