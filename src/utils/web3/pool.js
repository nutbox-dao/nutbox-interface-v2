import { getContract } from './contract'
import { ethers } from 'ethers'
import store from '@/store'
import { Transaction_config } from '@/config'
import { getNonce as gn, getMyCommunityInfo as gci, insertCommunity, updateCommunity } from '@/apis/api'
import { signMessage } from './utils'
import { errCode, Multi_Config } from '../../config'
import { waitForTx } from './ethers'
import {
    createWatcher
  } from '@makerdao/multicall'
import { getCToken, getRegitryAssets } from './asset'
import { getMyStakingFactory } from './community'


/**
 * Get opened pools of community
 * @returns
 */
 export const getMyOpenedPools = async (update = false) => {
    return new Promise(async (resolve, reject) => {
        if (!update && store.state.web3.myPools){
            resolve(store.state.web3.myPools);
            return;
        }
        let stakingFactoryId = null
        try{
            stakingFactoryId = await getMyStakingFactory()
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY);
                return;
            }
        }catch(e){
            reject(e);
            return;
        }

        let contract;
        try{
            contract = await getContract('StakingTemplate', stakingFactoryId, false);
        }catch(e){
            reject(e);
            return;
        }
       
        try{
            const poolCount = await contract.numberOfPools()
            if (poolCount === 0) {
                console.log('no pools');
                resolve([])
                return;
            }
            // get active pools
            let pools = await Promise.all((new Array(10).toString().split(',')).map((item, i) => contract.openedPools(i)))
            console.log(3214, pools);
            pools = pools.filter(pool => pool.hasActived)
            
            try{
                // get pool asset info
                const myAsset = await getRegitryAssets()
                console.log('myasset', myAsset);
                let idToIndex = {}
                myAsset.map((a, i) => idToIndex[a.asset] = i)
                console.log(idToIndex);
                pools = pools.map(pool => ({
                    pid: pool.pid,
                    poolName:pool.poolName,
                    poolRatio: pool.poolRatio,
                    stakerCount: pool.stakerCount,
                    stakingPair: pool.stakingPair,
                    totalStakedAmount: pool.totalStakedAmount,
                    asset: myAsset[idToIndex[pool.stakingPair]],
                }))
                store.commit('web3/saveMyPools', pools)
                resolve(pools);
            }catch(e) {
                reject(e);
            }
        }catch(e) {
            reject(errCode.BLOCK_CHAIN_ERR)
            return;
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
        let contract;
        try{
            contract = await getContract('StakingTemplate', stakingFactoryId, false)
        }catch(e) {
            reject(e);
            return
        }
        
        try{
            console.log(235, form.ratios, form.ratios.map(r => parseInt(r * 100)));
            const tx = await contract.addPool(form.assetId, form.name, form.ratios.map(r => parseInt(r * 100)))
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch (e) {
            console.log(542, e);
            reject(errCode.BLOCK_CHAIN_ERR)
        }
    })
}

/**
 * Update Pools ratios
 * @param {*} form 
 * @returns 
 */
export const updatePoolsRatio = async (form) => {
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
        let contract;
        try{
            contract = await getContract('StakingTemplate', stakingFactoryId, false)
        }catch(e){
            reject(e);
            return;
        }
        try{
            console.log(form);
            const tx = await contract.setPoolRatios(form.map(val => val*100))
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            reject(errCode.CONTRACT_CREATE_FAIL)
        }

    })
}
