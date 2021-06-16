import { getEthWeb } from './web3.js'
import store from '@/store'

/**
 * Get metamask accounts
 * @returns all accounts
 */
export const getAccounts = async () => {
    const metamask = await getEthWeb()
    const accounts = await metamask.request({ method: 'eth_requestAccounts' })
    let account = store.state.web3.account || accounts[0]
    store.commit('web3/saveAccount', account)
    store.commit('web3/saveAllAccounts', accounts)
    return accounts
}

export const changeAccount = async () => {
    const metamask = await getEthWeb()
    metamask.on('accountsChanged', (accounts) => {
        console.log('Changed accounts', accounts);
    })
}