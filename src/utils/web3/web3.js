import {
  sleep
} from "../helper"
import {
  BSC_CHAIN_ID,
  RPC_NODE,
  CHAIN_NAME,
  NATIVE_CURRENCY,
  BLOCK_CHAIN_BROWER
} from '@/config'
import store from '@/store'

import { getProvider } from './ethers'
import { getAccounts } from "./account"
import { getMyCommunityInfo } from './community'

/**
 * Add bsc to metamask
 * @returns 
 */
export const setupNetwork = async () => {
  await connectMetamask();
  const eth = await getEthWeb()
  const chainId = parseInt(BSC_CHAIN_ID)
  try {
    const res = await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`
      }],
    })
    store.commit('saveMetamaskConnected', true)
    store.commit('web3/saveChainId', chainId)
    return true
  } catch (error) {
    if (error.code === 4001) return;
    try{
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: CHAIN_NAME,
          rpcUrls:[RPC_NODE],
          nativeCurrency: NATIVE_CURRENCY,
          blockExplorerUrls: [BLOCK_CHAIN_BROWER]
        }],
      })
      store.commit('saveMetamaskConnected', true)
      store.commit('web3/saveChainId', chainId)
      return true
    }catch(error){
      console.log(43256, error);
      store.commit('web3/saveChainId', 0)
      store.commit('web3/saveAccount', null)
      store.commit('saveMetamaskConnected', false)
      return false
    }
  }
}

export const checkNetwork = async () => {
  const eth = await getEthWeb()
  const chainId = parseInt(BSC_CHAIN_ID)
  if (!eth) {
    store.commit('web3/saveAccount', null)
    store.commit('saveMetamaskConnected', false)
  }
  while(!eth.networkVersion) {
    await sleep(0.3)
  }
  if (parseInt(eth.networkVersion) == chainId) {
    store.commit('web3/saveChainId', chainId)
    store.commit('saveMetamaskConnected', true)
  }else {
    store.commit('web3/saveChainId', parseInt(eth.networkVersion))
    store.commit('web3/saveAccount', null)
    store.commit('saveMetamaskConnected', false)
  }
}

/**
 * Get metamask eth
 */
export const getEthWeb = async () => {
  if (typeof window.ethereum !== 'undefined') {
    if (!window.ethereum.isMetaMask) {
      console.log('Not metamask wallet');
    }
    return window.ethereum
  }
  var metamask = window.ethereum
  for (let i = 0; i < 10; i++) {
    if (typeof metamask !== 'undefined') {
      return metamask
    }
    await sleep(0.5)
    metamask = window.ethereum
  }
  
  return metamask
}

/**
 * Connect to Metamask
 */
export const connectMetamask = async () => {
  const metamask = await getEthWeb()
  await metamask.request({
    method: 'eth_requestAccounts'
  });
}

/**
 * User changed chain
 */
export const chainChanged = async (refresh) => {
  const metamask = await getEthWeb()
  metamask.on('chainChanged', async(chainId) => {
    console.log('Changed to new chain', parseInt(chainId));
    store.commit('web3/saveChainId', parseInt(chainId))
    refresh();
    return;
    if (parseInt(chainId) !== parseInt(BSC_CHAIN_ID)){
      store.commit('web3/saveAccount', null)
      store.commit('web3/saveStakingFactoryId', null)
      store.commit('web3/saveMyPools', null)
      store.commit('web3/saveAllAssetsOfUser', null)
      store.commit('saveMetamaskConnected', false)
    }else{
      await getAccounts(true)
      getProvider(true)
      store.commit('saveMetamaskConnected', true)
      getMyCommunityInfo(true).catch(e=>{})
      getMyOpenedPools(true)
    }
  })
}

/**
 * Is metamask unlocked
 * @returns bool
 */
export const isUnlocked = async () => {
  const metamask = await getEthWeb()
  return await metamask._metamask.isUnlocked()
}

/**
 * Monitor metamask lock state
 * @param {*} refresh 
 */
export const lockStatusChanged = async (refresh) => {
  while(true) {
    await sleep(3)
    if (await isUnlocked()){
    }else{
      store.commit('saveMetamaskConnected', false)
      if(!store.state.web3.account) continue;
      store.commit('web3/saveAccount', null)
      refresh()
      break;
    }
  }
}

/**
 * Add asset to metamask
 */
 export const addAssetToWallet = async (address, symbol, decimals, image) => {
  const metamask = await getEthWeb()
  metamask.request({
    method: 'wallet_watchAsset',
    params: {
      type: 'ERC20',
      options: {
        address,
        symbol,
        decimals,
        image
      }
    }
  }).then((success) => {
    if (success) {
      console.log(symbol, 'successfully added to wallet!');
    } else {
      console.log('Add asset faild');
    }
  }).catch(console.log)
}