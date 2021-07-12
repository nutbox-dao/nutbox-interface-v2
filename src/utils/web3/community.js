import { getContract } from './contract'
import { ethers } from 'ethers'
import store from '@/store'
import { Transaction_config } from '@/config'
import { getNonce as gn, getMyCommunityInfo as gci, insertCommunity, updateCommunity } from '@/apis/api'
import { signMessage } from './utils'
import { errCode } from '../../config'
import { waitForTx } from './ethers'

/**
 * Get community admin's staking factory id
 * @returns
 */
export const getMyStakingFactory = async (update=false) => {
    return new Promise(async (resolve, reject) => {
        const id = store.state.web3.stakingFactoryId
        if (!update && id){
            resolve(id);
        }
        const account = store.state.web3.account
        if (!account) return;
        const contract = await getContract('StakingFactory')
        let stakingFactoryId = null
        try{
            stakingFactoryId = await contract.stakingFeastRecord(account, 0)
        }catch(e){
            console.log(e);
            reject(errCode.BLOCK_CHAIN_ERR)
            return;
        }
        console.log('community', stakingFactoryId);
        store.commit('web3/saveStakingFactoryId', stakingFactoryId)
        resolve(stakingFactoryId)
    })
}

/**
 * Get community's infos from backend
 * @param {*} update
 * @returns
 */
export const getMyCommunityInfo = async (update=false) => {
    return new Promise(async (resolve, reject) => {
        let stakingFactoryId = null
        try{
            stakingFactoryId = await getMyStakingFactory(update)
        }catch(e){
            reject(e)
            return
        }
        if (!stakingFactoryId) return;
        if (!update && store.state.web3.communityInfo){
            resolve(store.state.web3.communityInfo)
            return;
        }
        let communityInfo = null;
        try{
            communityInfo = await gci(stakingFactoryId)
            if (communityInfo){
                store.commit('web3/saveCommunityInfo', communityInfo)
                resolve(communityInfo)
                return;
            }else{
                resolve({id: stakingFactoryId})
            }
        }catch(e){
            store.commit('web3/saveCommunityInfo', null)
            reject(e)
        }
    })
}

/**
 * Get opened pools of community
 * @returns
 */
export const getMyOpenedPools = async () => {
    const stakingFactoryId = await getMyStakingFactory()
    if (!stakingFactoryId) return;
    const contract = await getContract('StakingTemplate', stakingFactoryId)
    const pools = await contract.openedPools()
    console.log('pools', pools);
}

/**
 * Create Community Staking Factory Contracts
 * @param {*} form contract params
 */
export const createStakingFeast = async (form) => {
    const comId = await getMyStakingFactory()
    if (comId){
        return;
    }
    const contract = await getContract('StakingFactory')
    if (!contract) return
    try{
        // make params
        const assetId = form.assetId
        let distribution = form.poolData
        distribution = distribution.map(d => ({
            amount: ethers.utils.parseUnits(d.amount.toString(), form.decimal),
            hasPassed: false,
            startHeight: d.startHeight,
            stopHeight: d.stopHeight
        }))
        console.log(234, distribution);
        // call contract
        const res = await contract.createStakingFeast(assetId, distribution, Transaction_config)
        console.log(333, res.hash);
        return res.hash
    }catch(e){
        console.log('Create Staking Feast Failed', e);
        return;
    }
}

/**
 * Create or update community info to backend
 * @param {*} form
 */
export const completeCommunityInfo = async (form, type) => {
    return new Promise(async (resolve, rejct) => {
        let nonce = await getNonce()
        const userId = store.state.web3.account
        nonce = nonce ? nonce + 1 : 1
        const originMessage = JSON.stringify(form)
        const signature = await signMessage(originMessage + nonce)
        const params = {
            userId,
            infoStr: originMessage,
            nonce,
            signature
        }
        try{
            let res = null;
            if (type === 'create'){
                res  = await insertCommunity(params)
            }else{
                res = await updateCommunity(params)
            }
            // update nonce in storage
            store.commit('web3/saveNonce', nonce)
            resolve(res)
        }catch(e) {
            console.log('Insert community info failed', e);
            reject(500)
        }
    })

}

/**
 * Add new pool
 * @param {*} form 
 */
export const addPool = async (form) => {
    return new Promise(async (resolve, reject) => {
        let stakingFactoryId = null
        try{
            stakingFactoryId = await getMyStakingFactory()
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY)
                return;
            }
        }catch(e){
            reject(e)
            return
        }
        const contract = await getContract('StakingTemplate', stakingFactoryId)
        if (!contract) {
            reject(errCode.CONTRACT_CREATE_FAIL)
            return;
        }
        try{
            console.log(235, form.ratios, form.ratios.map(r => parseInt(r * 100)));
            const tx = await contract.addPool(form.assetId, form.ratios.map(r => parseInt(r * 100)))
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch (e) {
            console.log(542, e);
            reject(errCode.BLOCK_CHAIN_ERR)
        }
    })
}

/**
 * Get User's nonce
 * @param {*} update
 */
export const getNonce = async (update=false) => {
    let nonce = store.state.web3.nonce
    const account = store.state.web3.account
    if (!update && nonce) {
        return nonce
    }
    nonce = await gn(account)
    store.commit('web3/saveNonce', nonce)
    return nonce
}
