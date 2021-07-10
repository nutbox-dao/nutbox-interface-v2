import { ethers } from 'ethers'
import { getEthWeb } from './web3'
import store from '@/store'

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
 * Wait for the transaction comfirmed
 * @param {*} hash 
 */
export const waitForTx = async (hash) => {
    const provider = await getProvider()
    console.log(`Waiting for tx: ${hash}...`)
    while (!await provider.getTransactionReceipt(hash)) {
        sleep(1000)
    }
}