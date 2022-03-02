import {
    getContract,
    contractAddress,
    getPoolFactory
} from './contract'
import store from '@/store'
import { getAccounts } from '@/utils/web3/account'
import {
    errCode,
    Multi_Config
} from '@/config'
import {
    waitForTx
} from './ethers'
import {
    aggregate,
    createWatcher
} from '@makerdao/multicall'
import { ethers } from 'ethers'
import { resolve } from 'core-js/fn/promise'

export const getGauge = () => {
    return await getContract('Gauge', ethers.constants.AddressZero, false)
}

// vote a pool
export const lockNp = (pid, amount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.deposit(pid, amount)
            await waitForTx(tx.hash) 
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// down vote a pool
export const lockNp = (pid, amount) => {
    return new Promise(async (resolve, reject) => {
        try {
            const gauge = await getGauge()
            const tx = await gauge.withdraw(pid, amount)
            await waitForTx(tx.hash) 
            resolve(tx.hash)
        }catch (e) {
            reject(e)
        }
    })
}

// user withdraw from a gauge, reward include ctoken and nut
export const userWithdrawReward = (pid) => {
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
export const communityWithdrawNut = (communityId) => {
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

