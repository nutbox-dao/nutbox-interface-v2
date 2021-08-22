import { getEthWeb } from './web3.js'
import store from '@/store'
import {  getMyCommunityInfo, getNonce, monitorCommunity, getDistributionEras } from './community'
import { getMyOpenedPools, monitorPools } from './pool'
import { getRegitryAssets, monitorCtokenBalance } from './asset.js'

/**
 * Get metamask accounts
 * @returns all accounts
 */
export const getAccounts = async (update=false) => {
    if (store.state.web3.account && !update) {
        return store.state.web3.account;
    }
    const metamask = await getEthWeb()
    const accounts = await metamask.request({ method: 'eth_requestAccounts' })
    let account = accounts[0]
    store.commit('web3/saveAccount', account)
    store.commit('web3/saveAllAccounts', accounts)
    return accounts[0]
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
        getDistributionEras(true)
        monitorCtokenBalance(true)
        monitorPools()
    })
}