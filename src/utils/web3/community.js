import { getContract } from './contract'
import { ethers } from 'ethers'
import store from '@/store'
import { Transaction_config } from '@/config'
import { getNonce as gn, getMyCommunityInfo as gci, insertCommunity, updateCommunity } from '@/apis/api'
import { signMessage } from './utils'

/**
 * Get community admin's staking factory id
 * @returns 
 */
export const getMyStakingFactory = async (update=false) => {
    const id = store.state.web3.stakingFactoryId
    if (!update && id){
        return id;
    }
    const account = store.state.web3.account
    if (!account) return;
    const contract = await getContract('StakingFactory')
    let stakingFactoryId = null
    try{
        stakingFactoryId = await contract.stakingFeastRecord(account, 0)
    }catch(e){
        console.log(e);
    }
    console.log('community', stakingFactoryId);
    store.commit('web3/saveStakingFactoryId', stakingFactoryId)
    return stakingFactoryId
}

/**
 * Get community's infos from backend
 * @param {*} update 
 * @returns 
 */
export const getMyCommunityInfo = async (update=false) => {
    const stakingFactoryId = await getMyStakingFactory(update)
    if (!stakingFactoryId) return;
    if (!update && store.state.web3.communityInfo){
        return store.state.web3.communityInfo
    }
    let communityInfo = await gci(stakingFactoryId)
    if (communityInfo){
        store.commit('web3/saveCommunityInfo', communityInfo)
        return communityInfo
    }else{
        store.commit('web3/saveCommunityInfo', null)
        return {id: stakingFactoryId}
    }

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
export const compliteCommunityInfo = async (form, type) => {
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
        return 200
    }catch(e) {
        console.log('Insert community info failed', e);
        return e
    }
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