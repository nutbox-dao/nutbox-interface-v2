import {
    getContract,
    contractAddress
} from '@/utils/web3/contract'
import store from '@/store'
import { getAccounts } from '@/utils/web3/account'
import {
    errCode,
    Multi_Config
} from '@/config'
import {
    waitForTx
} from '@/utils/web3/ethers'
import {
    aggregate,
    createWatcher
} from '@makerdao/multicall'
import { ethers } from 'ethers'
import { rollingFunction } from '../helper'
import { getMyCommunityContract } from '@/utils/web3/community'

export const getGauge = async () => {
    return await getContract('Gauge', ethers.constants.AddressZero, false)
}

// vote a pool
export const lockNp = async (pid, amount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.vote(pid, amount)
            await waitForTx(tx.hash) 
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// down vote a pool
export const unlockNp = async (pid, amount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.unvote(pid, amount)
            await waitForTx(tx.hash) 
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// user withdraw from a gauge, reward include ctoken and nut
export const userWithdrawReward = async (pid) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.userWithdrawReward(pid)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// community withdraw nut from gauge, reward is nut
export const communityWithdrawNut = async (communityId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.communityWithdrawNut(communityId)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// get gauge related params like gaugeRatio
// store them to storage, these param are not often to updated 
export const getGaugeParams = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const [gaugeRatio, distributionRatio, nutReward] = await Promise.all([
                gauge.getGaugeRatio(),
                gauge.distributionRatio(),
                gauge.rewardNUTPerBlock()
            ])
            store.commit('gauge/saveGaugeRatio', gaugeRatio)
            store.commit('gauge/saveDistributionRatio', distributionRatio)
            store.commit('gauge/saveNutRewardPerBlock', nutReward)
            resolve()
        }catch(e) {
            reject(e)
        }
    })
}

// add a new guage for pool
export const addNewGauge = async (pid) => {
    return new Promise(async (resolve, reject) => {
        let stakingFactoryId = null
        try {
            stakingFactoryId = await getMyCommunityContract()
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY)
                return;
            }
        } catch (e) {
            reject(e)
            return
        }
        try{
            const gauge = await getGauge()
            const tx = await gauge.addNewGauge(stakingFactoryId, pid)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            reject(e)
        }
    })
}

// get wheather pool has created a gauge
// will called when create gauge page showing
export const hasGaugeEnabled = async (pools) => {
    return new Promise(async (resolve, reject) => {
        try{
            const res = await aggregate(pools.map(p => ({
                target: contractAddress['Gauge'],
                call:[
                    'hasGaugeEnabled(address)(bool)',
                    p
                ],
                returns:[
                    [p]
                ]
            })), Multi_Config)
            console.log('pooll', res.results.transformed);
            resolve(res.results.transformed)
        }catch(e) {
            reject(e)
        }
    })
}

// update user's gauge info by polling
// called when check in gauge page
// include userStaked/totalStaked/userPendingRewards(nut,ctoken)
/**
 * update user's gauge info by polling
 * called when check in gauge page
 * include userStaked/totalStaked/userPendingRewards(nut,ctoken)
 * @param {*} poolsId only gauges id
 * @returns 
 */
export const updateGaugesByPolling = (poolsId) => {
    const polling = rollingFunction(getGaugeVoteInfo, poolsId, 7, res => {
        let locked = {}
        let total = {}
        let pendingNut = {}
        let pendingCtoken = {}
        for (let d in res) {
            const [type, pid] = d.split('-')
            if(type === 'userLocked'){
                locked[pid] = res[d]
            }else if(type === 'totalLocked') {
                total[pid] = res[d]
            }else if (type === 'userRewardNut') {
                pendingNut[pid] = res[d]
            }else if (type === 'userRewardCtoken') {
                pendingCtoken[pid] = res[d]
            }
        }
        store.commit('gauge/saveUserLocked', locked || {})
        store.commit('gauge/saveTotalLocked', total || {})
        store.commit('gauge/saveUserRewardNut', pendingNut || {})
        store.commit('gauge/saveUserRewardCtoken', pendingCtoken || {})
    })
    polling.start()
    return polling
}

export const getGaugeVoteInfo = async (pools) => {
    return new Promise(async (resolve, reject) => {
        try{
            const account = await getAccounts();
            if (!account) {
                resolve();
                return;
            }
            const gaugeContract = contractAddress['Gauge']
            let calls = []
            for (let i = 0; i < pools.length; i++) {
                const pool = pools[i]
                calls.push({
                    target: gaugeContract,
                    call: [
                        'getUserLocked(address,address)(uint256)',
                        pool,
                        account
                    ],
                    returns: [
                        [`userLocked-` + pool, val => val.toString() / 1e18]
                    ]
                })
                calls.push({
                    target: gaugeContract,
                    call: [
                        'getGaugeTotalLocked(address)(uint256)',
                        pool
                    ],
                    returns: [
                        [`totalLocked-` + pool, val => val.toString() / 1e18]
                    ]
                })
                calls.push({
                    target: gaugeContract,
                    call: [
                        'getUserPendingReward(address,address)(uint256,uint256)',
                        pool,
                        account
                    ],
                    returns: [
                        [`userRewardNut-` + pool, val => val.toString() / 1e18],
                        [`userRewardCtoken-` + pool]   // need to known the ctoken decimals
                    ]
                })
            }
            const res = await aggregate(calls, Multi_Config)
            resolve(res.results.transformed)
        }catch(e) {
            console.log('Get user gauge info fail:', e);
            reject(e)
        }
    })
}

export const getCommunityPendingRewardNut = async () => {
    return new Promise(async (resolve, reject) => {
        let stakingFactoryId = null
        try {
            stakingFactoryId = await getMyCommunityContract()
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY)
                return;
            }
        } catch (e) {
            reject(e)
            return
        }
        try{
            const gauge = await getGauge()
            const pending = await gauge.getCommunityPendingRewardNut(stakingFactoryId)
            store.commit('gauge/saveCommunityPendingRewardNut', pending)
            resolve(pending)
        }catch(e) {
            reject(e)
        }
    })
}