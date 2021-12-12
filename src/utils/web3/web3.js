import {
  sleep
} from "../helper"
import {
  BSC_CHAIN_ID,
  RPC_NODE
} from '@/config'
import store from '@/store'

import { getProvider } from './ethers'
import { getAccounts } from "./account"
import { getRegitryAssets } from './asset'
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
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`
      }],
    })
    store.commit('saveMetamaskConnected', true)
    store.commit('web3/saveChainId', chainId)
    return true
  } catch (error) {
    try{
      await eth.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: `0x${chainId.toString(16)}`,
          chainName: CHAIN_NAME,
          rpcUrls:[RPC_NODE]
        }],
      })
    }catch(error){
      console.log(333, error);
      store.commit('web3/saveChainId', chainId)
      store.commit('web3/saveAccount', null)
      store.commit('web3/saveStakingFactoryId', null)
      store.commit('web3/saveMyPools', null)
      store.commit('web3/saveAllAssetsOfUser', null)
      store.commit('saveMetamaskConnected', false)
      return false
    }
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
    this.go
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
      getRegitryAssets(true)
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