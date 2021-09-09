import {
  getContract,
  contractAddress
} from "./contract";
import store from '@/store'
import {  getProvider } from './ethers'
import {
  createWatcher,
  aggregate
} from '@makerdao/multicall'
import {
  addressToHex
} from '@/utils/commen/account'
import { getAllCommunities } from '@/utils/web3/community'
import { getAccounts } from '@/utils/web3/account'
import {
  ethers
} from "ethers";
import {
  getWeb3
} from './web3'
import {
  waitForTx,
  getGasPrice
} from './ethers'
import {
  getAllTokens
} from '@/apis/api'
import { ASSET_LOGO_URL } from '@/constant'
import { errCode,
   CROWDLOAN_CHAINID_TO_NAME,
    DELEGATION_CHAINID_TO_NAME,
    Multi_Config,
    GasLimit
    } from "../../config";

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
    if (!update && assets && Object.keys(assets).length > 0) {
      resolve(assets)
      return;
    }
    const account = await getAccounts()
    let contract;
    try{
      contract = await getContract('RegistryHub', null);
    }catch(e){
      reject(e);
      return 
    }
    try{
      const assetCount = await contract.registryCounter(account);
      if (assetCount === 0){
        store.commit('web3/saveAllAssetsOfUser', [])
        resolve([])
        return;
      }
      // get register assets
      assets = await Promise.all((new Array(assetCount).toString().split(',').map((item, i) => contract.registryHub(account, i))))

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
 * Get community ctoken info
 * @param {*} update 
 * @returns 
 */
export const getCToken = async (communityId, update=false) => {
  return new Promise(async (resolve, reject) => {
    let cTokens = store.state.web3.cTokens
    if (!update && cTokens[communityId]){
      resolve(cTokens[communityId])
      return;
    }
    let contract;
    let registerHub;
    try{
      contract = await getContract('StakingTemplate', communityId)
      registerHub = await getContract('RegistryHub')
    }catch(e){
      reject(e)
      return
    }

    try{
      const assetId = await contract.rewardAsset()
      const tokenAddress = await registerHub.getHomeLocation(assetId);
      try{
        const cToken = await getERC20Info(tokenAddress);
        cToken["assetId"] = assetId
        cToken['isMintable'] = await registerHub.mintable(assetId);
        cTokens[assetId] = cToken
        store.commit('web3/saveCTokens', cTokens)
        resolve(cToken)
      }catch(e){
        reject(e);
        return
      }
    }catch(e){
      console.log(8889, e);
      reject(errCode.BLOCK_CHAIN_ERR)
      return;
    }
  })
}

/**
 * Query token if mintable
 * @param {*} assetId 
 */
export const isMintableAsset = async (assetId) => {
  return new Promise(async (resolve, reject) => {
    let registerHub;
    try{
      registerHub = await getContract('RegistryHub')
    }catch(e){
      reject(e)
      return
    }
    try{
      resolve(await registerHub.mintable(assetId));
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
  let contract;
  try{
    contract = await getContract(assetType === 'HomeChainAssetRegistry' ? 'RegistryHub' : assetType)
  }catch(e){
    reject(e);
    return;
  }
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
      icon = ASSET_LOGO_URL[CROWDLOAN_CHAINID_TO_NAME[meta[0]]].icon;
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
  return new Promise(async (resolve, reject) => {
    let contract;
    try{
      contract = await getContract('ERC20', address);
    }catch (e) {
      reject(e);
      return;
    }
    try{
      const tokens = await getAllTokenFromBackend()
      let infos = await aggregate([{
        target: address,
        call: ['name()(string)'],
        returns: [
          ['name']
        ]
      },{
        target: address,
        call: ['symbol()(string)'],
        returns: [
          ['symbol']
        ]
      },{
        target: address,
        call:[
          'decimals()(uint8)'
        ],
        returns: [
          ['decimals']
        ]
      }], Multi_Config)

      const tokenFromBackend = tokens?.filter(token => token.address === address)
      let icon = null
      if (tokenFromBackend && tokenFromBackend.length > 0) {
        icon = tokenFromBackend[0].icon
      }
      resolve({
        name: infos?.results?.transformed?.name,
        symbol: infos?.results?.transformed?.symbol,
        decimal: infos?.results?.transformed?.decimals,
        address,
        icon
      })
    }catch(e){
      reject(e)
    }
  })
}

/**
 * Check assetId have been registered before
 * TODO
 * @param {*} assetId 
 */
function checkAssetIfRegister(assetId){

}

/**
 * register homechain asset
 * @param {*} assetAddress
 */
export const registerHomeChainAsset = async (assetAddress) => {
  return new Promise(async (resolve, reject) => {
      // regitster asset
      let contract;
      try{
        contract = await getContract('HomeChainAssetRegistry', null, false);
      }catch(e) {
        reject(e);
        return;
      }

      // if address a token address
      try{
        const erc20 = await getContract('ERC20', assetAddress)
        const name = await erc20.name()
      }catch(e){
        reject(errCode.NOT_A_TOKEN_CONTRACT)
        return;
      }

      try {
        const gas = await getGasPrice()
        const tx = await contract.registerAsset(
          '0x', assetAddress, '0x',
          {
            gasPrice: gas,
            gasLimit: GasLimit
          }
        )
        await waitForTx(tx.hash)
        resolve(tx.hash)
      } catch (e) {
        if (e.code === 4001){
          reject(errCode.USER_CANCEL_SIGNING)
        }else if (e === errCode.TRANSACTION_FAIL) {
          reject(errCode.ASSET_EXIST)
        }else {
          reject(errCode.BLOCK_CHAIN_ERR)
        }
        console.log('Registry Homechain Asset Fail', e);
      }
  })
}

/**
 * Register steem/hive bind asset
 * @param {*} form 
 */
export const registerSteemHiveAsset = async (form) => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try{
      contract = await getContract('SteemHiveDelegateAssetRegistry', null, false);
    }catch(e){
      reject(e);
      return;
    }
    
    try {
      const web3 = await getWeb3()
      const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20)
      const foreignLocation = '0x' +
        ethers.utils.hexZeroPad(ethers.utils.hexlify(form.chainId), 1).substr(2) +
        web3.utils.stringToHex(form.chainId === 1 ? 'sp' : 'hp').substr(2) +
        ethers.utils.hexZeroPad(ethers.utils.hexlify(form.account.length), 4).substr(2) +
        web3.utils.stringToHex(form.account).substr(2)
      const gas = await getGasPrice()
      const tx = await contract.registerAsset(
        foreignLocation, homeChain, web3.utils.stringToHex(form.assetName),
        {
          gasPrice: gas,
          gasLimit: GasLimit
        }
      )
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else if (e === errCode.TRANSACTION_FAIL) {
        reject(errCode.ASSET_EXIST)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
    }
  })
}

/**
 * Register crowdloan on polkadot as a binding asset
 * @param {*} form 
 */
export const registerCrowdloanAsset = async (form) => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try{
      contract = await getContract('SubstrateCrowdloanAssetRegistry', null, false);
    }catch(e){
      reject(e);
      return;
    }
    
    try {
      const web3 = await getWeb3()
      const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20);
      const foreignLocation = '0x' +
        ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.chainId)), 1).substr(2) + // chainId: polkadot: 2 ; kusama: 3
        ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.paraId)), 4).substr(2) + // paraId: 2004
        ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.trieIndex)), 4).substr(2) + // trieIndex: 4
        addressToHex(form.communityAddress).substr(2) // communityAccount
      console.log(foreignLocation, form);
      const gas = await getGasPrice()
      const tx = await contract.registerAsset(foreignLocation, homeChain, web3.utils.stringToHex(JSON.stringify({
        name: form.assetName,
        endingBlock: form.endingBlock
      })),
      {
        gasPrice: gas,
        gasLimit: GasLimit
      })
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else if (e === errCode.TRANSACTION_FAIL) {
        reject(errCode.ASSET_EXIST)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
    }
  })
}

/**
 * Register validate node binding asset
 * @param {*} form 
 * @returns 
 */
export const registerNominateAsset = async (form) => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try{
      contract = await getContract('SubstrateNominateAssetRegistry', null, false);
    }catch(e){
      reject(e)
      return;
    }
    
    try {
      const web3 = await getWeb3()
      const homeChain = ethers.utils.hexZeroPad(ethers.utils.hexlify(0), 20);
      console.log('chainid', form);
      const foreignLocation = '0x' +
        ethers.utils.hexZeroPad(ethers.utils.hexlify(parseInt(form.chainId)), 1).substr(2) + // chainId: polkadot
        addressToHex(form.nodeAddress).substr(2) // node address
      const gas = await getGasPrice()
      const tx = await contract.registerAsset(foreignLocation, homeChain, web3.utils.stringToHex(form.assetName),
      {
        gasPrice: gas,
        gasLimit: GasLimit
      })
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else if (e === errCode.TRANSACTION_FAIL) {
        reject(errCode.ASSET_EXIST)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
    }
  })
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
}, isMintable) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getContract('ERC20Factory', null, false)
      contract.on('ERC20TokenCreated', (_creator, _name, _symbol, _tokenAddress, _isMintable, _assetId) => {
        console.log(_tokenAddress, _name, _symbol, _isMintable, _assetId);
        if (store.state.web3.account === _creator, name === _name, symbol === _symbol, isMintable === _isMintable){
          contract.removeAllListeners('ERC20TokenCreated')
          resolve(_tokenAddress)
          return;
        }
      })
      const gas = await getGasPrice()
      const tx = await contract.createERC20(name, symbol, ethers.utils.parseUnits(totalSupply, decimal), 
      store.state.web3.account, 
      isMintable, 
      {
        gasPrice: gas,
        gasLimit: GasLimit
      });
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      }else{
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log(`Deploy mintable token ${name} failed`, e);
    }
  })
}

/**
 * Get all tokens from nutbox backend
 * Will store data to cache
 * @param {*} update  wheather update local cache
 * @returns 
 */
export const getAllTokenFromBackend = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const tokens = store.state.web3.allTokens
    if (!update && tokens) {
      resolve(tokens)
    }
    try {
      const allTokens = await getAllTokens()
      store.commit('web3/saveAllTokens', allTokens)
      resolve(allTokens)
    } catch (e) {
      reject(500)
    }
  })
}

/**
 * monitor all ctoken balance of user
 * used in wallet
 */
export const monitorCtokenBalance = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    try {
      let ctokenBalances = store.state.web3.ctokenBalances
      if (ctokenBalances.length > 0 && !update){
        resolve();
        return;
      }
      const allCommunities = await getAllCommunities()
      let watchers = store.state.web3.watchers
      let watcher = watchers['ctoken']
      store.commit('web3/saveLoadingCtokenBalances', true)
      watcher && watcher.stop()
      const account = await getAccounts();
      watcher = createWatcher(allCommunities.map(c => ({
        target: c.ctoken,
        call:[
          'balanceOf(address)(uint256)',
          account
        ],
        returns:[
          [c.ctoken]
        ]
      })), Multi_Config)
      watcher.batch().subscribe(updates => {
        updates.map(u => {
          const t = allCommunities.filter(c => c.ctoken === u.type)[0]
          ctokenBalances[u.type] = {
            logo: t.tokenIcon,
            balance: u.value,
            name: t.tokenName,
            symbol: t.tokenSymbol
          }
        })
        // console.log('Updates ctoken balances', ctokenBalances);
        store.commit('web3/saveLoadingCtokenBalances', false)
        store.commit('web3/saveCtokenBalances', {...ctokenBalances})
      })
      watcher.start()
      watchers['ctoken'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    }catch (e) {
      reject(e);
    }
  })
}

/**
 * get home chain balance
 * @returns 
 */
export const getBalance = async () => {
  const provider = await getProvider()
  const account = await getAccounts()
  return await provider.getBalance(account);
}