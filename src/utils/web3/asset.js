import {
  getContract,
  getAbi,
  contractAddress
} from "./contract";
import store from '@/store'
import {
  addressToHex
} from '@/utils/commen/account'
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
import {
  getAllTokens
} from '@/apis/api'
import { ASSET_LOGO_URL } from '@/constant'
import { errCode, CROWDLOAN_CHAINID_TO_NAME, DELEGATION_CHAINID_TO_NAME } from "../../config";

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
  for (let contract in contractAddress) {
    if (contractAddress[contract].toLowerCase() === address.toLowerCase()) {
      return contract
    }
  }
}

/**
 * Get regisryAssets of user
 * Restore these infos to cache
 * @returns assets list contains detail infos
 */
export const getRegitryAssets = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    let assets = store.state.web3.allAssetsOfUser
    if (!update && assets) {
      resolve(assets)
    }
    const account = store.state.web3.account
    const contract = await getContract('RegistryHub');
    if (!contract){
      reject(errCode.CONTRACT_CREATE_FAIL);
      return;
    } 
    try{
      const assetCount = await contract.registryCounter(account);
      // get register assets
      assets = await Promise.all((new Array(assetCount).toString().split(',').map((item, i) => contract.registryHub(account, i))))
      if(assets.length === 0) {
        resolve([]);
        return;
      }
      // get assets contract and type
      const registryContract = await Promise.all(assets.map(asset => contract.getRegistryContract(asset)))
      assets = assets.map((asset, index) => ({
        asset,
        contract: registryContract[index],
        type: assetType(registryContract[index])
      }));
      // get metadata of assets
      const metadatas = await Promise.all(assets.map(asset => getAssetMetadata(asset.asset, asset.type)))
    
      assets = assets.map((asset, index) => ({
        ...asset,
        ...metadatas[index]
      }))
      store.commit('web3/saveAllAssetsOfUser', assets)
      resolve(assets)
    }catch(e){
      reject(errCode.BLOCK_CHAIN_ERR)
    }
  })
}

/**
 * get asset meta data
 * @param {String} id asset id 
 * @param {String} assetType asset contract address
 */
export const getAssetMetadata = async (id, assetType) => {
  const contract = await getContract(assetType === 'HomeChainAssetRegistry' ? 'RegistryHub' : assetType)
  if (!contract) return;
  if (assetType === 'HomeChainAssetRegistry') {
    const homeLocation = await contract.getHomeLocation(id)
    return await getERC20Info(homeLocation)
  }
  let meta = await contract.idToMetadata(id)
  let icon = ''
  switch(assetType){
    case 'SteemHiveDelegateAssetRegistry':
      icon = ASSET_LOGO_URL[DELEGATION_CHAINID_TO_NAME[meta[0]]]
      meta = {
        chainId: meta[0],
        assetType: meta[1],
        agentAccount: meta[2],
        icon
      }
      break;
    case 'SubstrateCrowdloanAssetRegistry':
      icon = ASSET_LOGO_URL[CROWDLOAN_CHAINID_TO_NAME[meta[0]]][parseInt(meta[1])]
      meta = {
        chainId: meta[0],
        paraId: meta[1],
        trieIndex: meta[2],
        communityAccount: meta[3],
        icon
      }
      break;
    case 'SubstrateNominateAssetRegistry':
      icon = '';
      meta = {
        chainId: meta[0],
        validatorAccount:meta[1],
        icon
      }
      break;
    default:
      break;
  }
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
  if (tokenFromBackend && tokenFromBackend.length > 0) {
    icon = tokenFromBackend[0].icon
  }
  return {
    name: infos[0],
    symbol: infos[1],
    decimal: infos[2],
    address,
    icon
  }
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
  try {
    const tx = await contract.registerAsset(
      '0x', assetAddress, '0x',
      Transaction_config
    )
    await waitForTx(tx.hash)
    return tx
  } catch (e) {
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
  try {
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
  } catch (e) {
    throw (e)
  }
}

/**
 * Register crowdloan on polkadot as a binding asset
 * @param {*} form 
 */
export const registerCrowdloanAsset = async (form) => {
  const contract = await getContract('SubstrateCrowdloanAssetRegistry');
  if (!contract) return;
  try {
    const web3 = await getWeb3()
    const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20);
    const foreignLocation = '0x' +
      ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.chainId)), 1).substr(2) + // chainId: polkadot: 2 ; kusama: 3
      ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.paraId)), 4).substr(2) + // paraId: 2004
      ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.trieIndex)), 4).substr(2) + // trieIndex: 4
      addressToHex(form.communityAddress).substr(2) // communityAccount
    console.log(foreignLocation, form);

    const tx = await contract.registerAsset(foreignLocation, homeChain, web3.utils.stringToHex(JSON.stringify({
      name: form.assetName,
      endingBlock: form.endingBlock
    })), Transaction_config)
    await waitForTx(tx.hash)
    return tx.hash
  } catch (e) {
    throw (e)
  }
}

/**
 * Register validate node binding asset
 * @param {*} form 
 * @returns 
 */
export const registerNominateAsset = async (form) => {
  const contract = await getContract('SubstrateNominateAssetRegistry');
  if (!contract) return;
  try {
    const web3 = await getWeb3()
    const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20);
    const foreignLocation = '0x' +
      ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.chainId)), 1).substr(2) + // chainId: polkadot
      addressToHex(form.nodeAddress).substr(2) // node address

    const tx = await contract.registerAsset(foreignLocation, homeChain, web3.utils.stringToHex(form.assetName), Transaction_config)
    await waitForTx(tx.hash)
    return tx.hash
  } catch (e) {
    throw e
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
export const getAllTokenFromBackend = async (update = false) => {
  const tokens = store.state.web3.allTokens
  if (!update && tokens) {
    return tokens
  }
  try {
    const allTokens = await getAllTokens()
    store.commit('web3/saveAllTokens', allTokens)
    return allTokens
  } catch (e) {
    console.log('Get All Tokens Failed', e);
    return null
  }

}
