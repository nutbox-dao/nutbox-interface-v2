import {
  sleep
} from "../helper"
import {
  BSC_CHAIN_ID,
  RPC_NODE,
  Multi_Config
} from '@/config'
import Web3 from "web3"
import store from '@/store'

import {
  createWatcher
} from '@makerdao/multicall'

import { getProvider } from './ethers'

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
      method: 'wallet_addEthereumChain',
      params: [{
        chainId: `0x${chainId.toString(16)}`,
        chainName: 'Binance Smart Chain Mainnet',
        nativeCurrency: {
          name: 'BNB',
          symbol: 'bnb',
          decimals: 18,
        },
        rpcUrls: [RPC_NODE],
        blockExplorerUrls: ['https://bscscan.com/'],
      }],
    })
    store.commit('web3/saveChainId', chainId)
    return true
  } catch (error) {
    console.log(333, error);
    store.commit('web3/saveChainId', chainId)
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
  metamask.request({
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
    getProvider(true)
    // window.location.reload()
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

export const testMulticall = async () => {
  const watcher = createWatcher([{
    target: '0xbA4218Da36D2269B4aD36934b08872B370D9e63D',
    call: [
      'isMintable()(bool)'
    ],
    returns: [
      ['TC_BALANCE']
    ]
  }], Multi_Config)


  // watcher.subscribe(update => {
  //   console.log(`Update: ${update.type} = ${update.value}`);
  // })
  // Subscribe to batched state updates
  watcher.batch().subscribe(updates => {
    // Handle batched updates here
    // Updates are returned as { type, value } objects, e.g:
    // { type: 'BALANCE_OF_MKR_WHALE', value: 70000 }
    console.log('Updates', updates);
    watcher.stop()
  });


  // watcher.onNewBlock(blockNumber => {
  //   console.log('New Block:', blockNumber);
  //   watcher.stop()
  // })

  console.log('watcher start');

  watcher.start();
}
