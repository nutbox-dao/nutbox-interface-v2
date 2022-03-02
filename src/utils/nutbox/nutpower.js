
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

export const getBalance = async () => {
    const np = await getContract('NutPower')
    const account = await getAccounts()
    const balance = await np.balanceOf(account)
    return balance;
}

async function getNpContract() {
    return getContract('NutPower', ethers.constants.AddressZero, false)
}

export const powerUp = async (amount, period) => {
    return new Promise(async (resolve, reject) => {
        try{
            const np = await getNpContract();
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
