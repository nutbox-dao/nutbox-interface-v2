import { getEthWeb } from './web3.js'
import store from '@/store'
import {  getMyCommunityInfo, getNonce, monitorCommunity } from './community'
import { getMyOpenedPools, monitorPools } from './pool'
import { getRegitryAssets } from './asset.js'

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

/**
 * Monitor BSC account change event
 */
export const accountChanged = async () => {
    const metamask = await getEthWeb()
    metamask.on('accountsChanged', (accounts) => {
        console.log('Changed accounts', accounts);
        store.commit('web3/saveAccount', accounts[0])
        store.commit('web3/saveStakingFactoryId', null)
        store.commit('web3/saveMyPools', [])
        store.commit('web3/saveAllAssetsOfUser', [])
        getRegitryAssets(true)
        getMyCommunityInfo(true).then(res => {
            monitorCommunity()
        }).catch(console.error)
        getMyOpenedPools(true)
        getNonce(true)
        monitorPools()
    })
}