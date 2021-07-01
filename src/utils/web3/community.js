import { getContract } from './contract'
import store from '@/store'

/**
 * Get community admin's staking factory id
 * @returns 
 */
export const getMyStakingFactory = async () => {
    const id = store.state.web3.stakingFactoryId
    if (id){
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