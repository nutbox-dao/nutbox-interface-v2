import {
  sleep
} from "../helper"
import {
  BSC_CHAIN_ID,
  RPC_NODE,
  CHAIN_NAME
} from '@/config'
import Web3 from "web3"
import store from '@/store'

import { getProvider } from './ethers'
import { getAccounts } from "./account"

export const getWeb3 = () => {
  const web3  = new Web3(RPC_NODE)
  return web3
}

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
      // method: 'wallet_addEthereumChain',
      method: 'wallet_switchEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`
        // chainName: CHAIN_NAME,
        // nativeCurrency: {
        //   name: 'BNB',
        //   symbol: 'bnb',
        //   decimals: 18,
        // },
        // rpcUrls: [RPC_NODE],
        // blockExplorerUrls: ['https://bscscan.com/'],
      }],
    })
    store.commit('web3/saveChainId', chainId)
    return true
  } catch (error) {
    console.log(333, error);
    store.commit('web3/saveChainId', chainId)
    store.commit('web3/saveAccount', null)
    store.commit('web3/saveStakingFactoryId', null)
    store.commit('web3/saveMyPools', [])
    store.commit('web3/saveAllAssetsOfUser', [])
    store.commit('saveMetamaskConnected', false)
    return false
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
export const chainChanged = async () => {
  const metamask = await getEthWeb()
  console.log('monitor chain id');
  metamask.on('chainChanged', (chainId) => {
    console.log('Changed to new chain', parseInt(chainId));
    store.commit('web3/saveChainId', parseInt(chainId))
    if (parseInt(chainId) !== parseInt(BSC_CHAIN_ID)){
      store.commit('web3/saveAccount', null)
      store.commit('web3/saveStakingFactoryId', null)
      store.commit('web3/saveMyPools', [])
      store.commit('web3/saveAllAssetsOfUser', [])
      store.commit('saveMetamaskConnected', false)
    }else{
      getProvider(true)
      store.commit('saveMetamaskConnected', true)
      getAccounts(true)
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

export const test = async () => {
  
  // const contract = await getContract('REGISTRYHUB', '0xF6149F38bEA7bB07a779AF30Ee1983566e5E1218')
  // if (!contract) return 
  // try{
  //     const tx = await contract.setWhiteList(
  //         '0xD8930d33FCb22e9c96D35d7466B86f5801047D4c'
  //     )
  // }catch (e) {
  //     if (e.code === 4001){
  //         // User cancel transaction
  //         console.log('User cancel the transaction');
  //     }
  // }
  await testMulticall()


}