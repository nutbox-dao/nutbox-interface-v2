import { ethers } from 'ethers'
import { getEthWeb } from './web3'
import store from '@/store'
import { RPC_NODE, errCode } from '@/config'
import { sleep } from '@/utils/helper'

/**
 * Get metamask provider
 * @returns 
 */
export const getProvider = async (force = false) => {
    if (store.state.web3.ethers && !force) {
        return store.state.web3.ethers
    }
    const metamask = await getEthWeb()
    const provider = new ethers.providers.Web3Provider(metamask)
    store.commit('web3/saveEthers', provider)
    return provider 
}

/**
 * Readonly provider
 * If user do not install metamask, use this provider can read the contract data 
 * @returns 
 */
export const getReadonlyProvider = () => {
    if (store.state.web3.readonlyProvider){
        return store.state.web3.readonlyProvider
    }
    const provider = new ethers.providers.JsonRpcProvider(RPC_NODE)
    store.commit('web3/saveReadonlyProvider', provider)
    return provider;
}

/**
 * get price
 */
export const getGasPrice = async () => {
    const provider = await getProvider()
    return await provider.getGasPrice()
}

/**
 * Wait for the transaction comfirmed
 * @param {*} hash 
 */
export const waitForTx = async (hash) => {
    return new Promise(async (resolve, reject) => {
        try{
            const provider = await getProvider()
            console.log(`Waiting for tx: ${hash}...`)
            let trx = await provider.getTransactionReceipt(hash)
            while (!trx) {
                await sleep(1)
                trx = await provider.getTransactionReceipt(hash)
            }
            if (trx.status !== 0) {
                resolve()
            }else{
                console.log('tx fail status:', trx.status);
                reject(errCode.TRANSACTION_FAIL)
            }
        }catch(err) {
            console.log('tx fail:', err);
            reject(errCode.TRANSACTION_FAIL)
        }
    })
}

export const getAddress = (address) => {
    try{
        return ethers.utils.getAddress(address);
    }catch(err) {
        return false
    }
}

export const randomWallet = async () => {
    return new Promise(async (resolve) => {
      try {
        const wallet = ethers.Wallet.createRandom();
        const nemonic = wallet.mnemonic.phrase;
        const privateKey = wallet.privateKey;
        const address = await wallet.getAddress();
        resolve({nemonic, privateKey, address})
      } catch (error) {
        console.log('generate random nemonic fail');
        resolve(false)
      }
    })
  }