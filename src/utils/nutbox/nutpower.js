
import {
    getContract,
    contractAddress
} from '@/utils/web3/contract'
import store from '@/store'
import { getAccounts } from '@/utils/web3/account'
import {
    Multi_Config,
    NutAddress
} from '@/config'
import { YEAR_BLOCKS } from '@/constant'
import {
    waitForTx
} from '@/utils/web3/ethers'
import {
    aggregate
} from '@makerdao/multicall'
import { ethers } from 'ethers'
import { rollingFunction } from '../helper'

export const updateBalanceByPolling = () => {
    const polling = rollingFunction(getBalance, null, 10, res => {
        const freeNp = res.freeNp;
        const lockedNp = res.lockedNp
        store.commit('np/saveBalance', {freeNp, lockedNp})
        const lockedNut = [0,1,2,3,4,5,6].map(i => res[i.toString()])
        store.commit('np/saveUserLockedNut', lockedNut)
    })
    polling.start()
    return polling
}

// get np and locked nut balance
export const getBalance = async () => {
    const np = await getContract('NutPower')
    const account = await getAccounts()
    let calls = [
        {
            target: contractAddress['NutPower'],
            call: [
                'balanceOf(address)(uint256,uint256)',
                account
            ],
            returns: [
                ['freeNp', val => val.toString() / 1e18],
                ['lockedNp', val => val.toString() / 1e18]
            ]
        }
    ]
    calls = calls.concat([0,1,2,3,4,5,6].map(idx => ({
        target: contractAddress['NutPower'],
        call: [
            'lockedNutOfPeriod(address,uint8)(uint256)',
            account,
            idx
        ],
        returns: [
            [idx.toString(), val => val.toString() / 1e18]
        ]
    })))
    const res = await aggregate(calls, Multi_Config)
    // lockedNutOfPeriod
    return res.results.transformed;
}

async function getNpContract() {
    return getContract('NutPower', ethers.constants.AddressZero, false)
}

export const powerUp = async (amount, period) => {
    return new Promise(async (resolve, reject) => {
        try{
            amount = ethers.utils.parseUnits(amount.toString(), 18)
            const np = await getNpContract();
            console.log('235', amount, period);
            
            const tx = await np.powerUp(amount, period)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            console.log('Power up fail:', e);
            reject(e)
        }
    })
}

export const powerDown = async (amount, period) => {
    return new Promise(async (resolve, reject) => {
        try{
            amount = ethers.utils.parseUnits(amount.toString(), 18)
            const np = await getNpContract();
            const tx = await np.powerDown(amount, period)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            console.log('Power down fail:', e);
            reject(e)
        }
    })
}

export const upgrade = async (amount, src, dest) => {
    return new Promise(async (resolve, reject) => {
        try{
            amount = ethers.utils.parseUnits(amount.toString(), 18)
            const np = await getNpContract();
            const tx = await np.upgrade(amount, src, dest)
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            console.log('upgrade fail:', e);
            reject(e)
        }
    })
}

export const redeem = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            const np = await getNpContract();
            const tx = await np.redeem()
            await waitForTx(tx.hash)
            resolve(tx.hash)
        }catch(e) {
            console.log('Redeem fail:', e);
            reject(e)
        }
    })
}

export const getUserRedeemRequestsOfPeriod = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const np = await getNpContract();
            const account = await getAccounts()
            const redeemInfo = await Promise.all([0,1,2,3,4,5,6].map(idx => 
                np.redeemRequestsOfPeriod(account, idx)
            ))
            console.log(redeemInfo);
        }catch(e) {
            console.log('Get user redeem requests fail:', e);
            reject(e)
        }
    })
}

export const getNPInfoByPolling = () => {
    const polling = rollingFunction(getNPAndGaugeInfo, null, 8, res => {
        const totalSupply = res['totalSupply']
        // poweruped nut
        const totalLockedNut = res['totalLockedNut']
        const gaugeRatio = res['gaugeRatio']
        const communityRatio = res['communityRatio']
        const poolFactoryRatio = res['poolFactoryRatio']
        const userRatio = res['userRatio']
        const rewardNutPerBlock = res['rewardNutPerBlock']
        // locked nut in gauge
        const totalNPLocked = res['totalNPLocked']

        store.commit('gauge/saveGaugeRatio', gaugeRatio)
        store.commit('gauge/saveDistributionRatio', {communityRatio, poolFactoryRatio, userRatio})
        store.commit('gauge/saveNutRewardPerBlock', rewardNutPerBlock)

        store.commit('np/saveTotalSupply', totalSupply)
        store.commit('np/saveTotalLockedNut', totalLockedNut)
        const prices = store.state.prices
        const npPrice = prices[NutAddress] * totalLockedNut / totalSupply
        store.commit('np/saveNpPrice', npPrice)

        // Np apr in gauge for user
        let userNutApr = YEAR_BLOCKS * rewardNutPerBlock * 100 / (totalNPLocked * totalLockedNut / totalSupply)
        store.commit('np/saveNpApr', userNutApr)
    })
    polling.start;
    return polling;
}

// get nutpower and gauge common data
export const getNPAndGaugeInfo = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            const res = await aggregate([
                {
                    target: contractAddress['NutPower'],
                    call: [
                        'totalLockedNut()(uint256)'
                    ],
                    returns:[
                        ['totalLockedNut', val => val.toString() / 1e18]
                    ]
                },
                {
                    target: contractAddress['NutPower'],
                    call: [
                        'totalSupply()(uint256)'
                    ],
                    returns:[
                        ['totalSupply', val => val.toString() / 1e18]
                    ]
                },
                {
                    target: contractAddress['Gauge'],
                    call:[
                        'getGaugeRatio()(uint16)'
                    ],
                    returns: [
                        ['gaugeRatio']
                    ]
                },
                {
                    target: contractAddress['Gauge'],
                    call:[
                        'distributionRatio()(uint16,uint16,uint16)'
                    ],
                    returns: [
                        ['communityRatio'],
                        ['poolFactoryRatio'],
                        ['userRatio']
                    ]
                },
                {
                    target: contractAddress['Gauge'],
                    call:[
                        'rewardNUTPerBlock()(uint256)'
                    ],
                    returns: [
                        ['rewardNutPerBlock', val => val.toString() / 1e18]
                    ]
                },
                {
                    target: contractAddress['Gauge'],
                    call: [
                        'totalNPLocked()(uint256)'
                    ],
                    returns: [
                        ['totalNPLocked', val => val.toString() / 1e18]
                    ]
                }
            ], Multi_Config)
            resolve(res.results.transformed)
        }catch(e){
            reject(e)
        }
    })
}

// get user's nut balance by polling and aprovement to NutPower
export const pollingNutBalance = async () => {
    const account = await getAccounts()
    const nut = await getContract('ERC20', NutAddress)
    const polling = rollingFunction(async () => {
        try {
            const balance = await nut.balanceOf(account)
            store.commit('user/saveNutBalance', balance.toString() / 1e18)
            const allowance = await nut.allowance(account, contractAddress['NutPower'])
            store.commit('user/saveApproveToNutPower', allowance.toString() / 1e18 > 1e12)
            store.commit('user/saveLoadingApproveToNutPower', false)
        }catch(e){}
    }, null, 10 ,res => {})
    polling.start()
    return polling;
}