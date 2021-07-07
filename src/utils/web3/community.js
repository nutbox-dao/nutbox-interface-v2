import { getContract } from './contract'
import { ethers } from 'ethers'
import store from '@/store'
import { Transaction_config } from '@/config'

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