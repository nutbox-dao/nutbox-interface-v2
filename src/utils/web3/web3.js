import {
  sleep
} from "../helper"
import {
  BSC_CHAIN_ID,
  RPC_NODE
} from '@/config'
import Web3 from "web3"
import {
  getContract
} from './contract'
import store from '@/store'

import {
  createWatcher
} from '@makerdao/multicall'

import {
    hexToString,
  } from "@polkadot/util"
  

/**
 * Add bsc to metamask
 * @returns 
 */
export const setupNetwork = async () => {
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
    // console.log(333, error);
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
    metamask = window.ethereum
    await sleep(0.5)
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
  metamask.on('chainChanged', (chainId) => {
    console.log('Changed to new chain', parseInt(chainId));
    store.commit('web3/saveChainId', parseInt(chainId))
    // window.location.reload()
  })
}

/**
 * Is metamask unlocked
 * @returns bool
 */
export const isUnlocked = async () => {
  const metamask = await getEthWeb()
  return metamask._metamask.isUnlocked()
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


/**************************************web3*****************************************************/

export const getWeb3 = async () => {
  const web3 = new Web3(RPC_NODE || Web3.givenProvider)
  return web3
}


export const test = async () => {
  // const ethw = await getWeb3()

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
  const config = {
    rpcUrl: 'http://localhost:8545',
    multicallAddress: '0xE592738f39FdfE67Daf2f7b8b5bef8FaF1C68C46'
  }

  const watcher = createWatcher([{
      target: '0x0a5101FaB7Ed01F9B6D8bEDd94BC617D7ed6Bad9',
      call: [
          'balanceOf(address)(uint256)',
          '0xb182f4892397BF758179B220C881E32ce6EE32E2'
      ],
      returns: [
          ['TC_BALANCE', val => val / 10 ** 18]
      ]
  },{
      target: '0x59A040E99f62445C52f2f272b5AeEC0FF1b5A133',
      call: [
          'whiteList(address)(bool)',
          '0x5B91d7D24Ec4e1A29B9699e8cf351D1e29c558Bc'
      ],
      returns: [
          ['WHITE_LIST', val => val]
      ]
  },{
    target: '0x59A040E99f62445C52f2f272b5AeEC0FF1b5A133',
    call: [
        'registryCounter(address)(uint8)',
        '0x5B91d7D24Ec4e1A29B9699e8cf351D1e29c558Bc'
    ],
    returns: [
        ['REGISTRY_COUNTER', val => val]
    ]
}], config)

  watcher.subscribe(update => {
    console.log(`Update: ${update.type} = ${update.value}`);
  })
  // Subscribe to batched state updates
  watcher.batch().subscribe(updates => {
    // Handle batched updates here
    // Updates are returned as { type, value } objects, e.g:
    // { type: 'BALANCE_OF_MKR_WHALE', value: 70000 }
    console.log('Updates', updates);
  });


  watcher.onNewBlock(blockNumber => {
    console.log('New Block:', blockNumber);
  })

  console.log('watcher start');

  watcher.start();
}
