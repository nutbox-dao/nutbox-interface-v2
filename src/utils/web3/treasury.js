import {
  getContract,
  contractAddress,
  getPoolFactory,
  getPoolTypeName
} from './contract'
import store from '@/store'
import {
  getAccounts
} from '@/utils/web3/account'
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
import {
  getMyCommunityContract
} from './community'
import {
  NutAddress,
  CHAIN_NAME
} from '@/config'
import {
  ethers
} from 'ethers'
import {
  rollingFunction
} from '@/utils/helper'

export const getMyTreasury = async () => {
  return new Promise(async (resolve, reject) => {
    let communityId = null
    try {
      communityId = await getMyCommunityContract()
      if (!communityId) {
        reject(errCode.NO_STAKING_FACTORY)
        return;
      }
    } catch (e) {
      reject(e)
      return
    }
   resolve(await getTreasury(communityId))
  })
}

export const getTreasury = async (communityId) => {
    try {
        const contract = await getContract("TreasuryFactory");
        const treasury = await contract.treasuryOfCommunity(communityId)
        return treasury
    }catch (e) {
        return
    }
}

export const getTreasuryTokens = async () => {
    return new Promise(async (resolve, reject) => {
        try{
            let treasuryTokens = store.state.web3.treasuryTokens
            if (treasuryTokens) {
                resolve(treasuryTokens)
                return;
            }
            const contract = await getContract("TreasuryFactory");
            treasuryTokens = await contract.getRewardList();
            store.commit('web3/saveTreasuryTokens', treasuryTokens)
            resolve(treasuryTokens)
        } catch (e) {
            return
        }
    })
}

export const getTreasuryBalance = async (treasury) => {
    return new Promise(async (resolve, reject) => {
        try{
            let treasuryTokens = await getTreasuryTokens()
            if (treasuryTokens) {
                const balances = await aggregate(treasuryTokens.map(t => ({
                    target: t,
                    call:[
                        'balanceOf(address)(uint256)',
                        treasury
                    ],
                    returns: [
                        [t + '-balance']
                    ]
                }).concat(treasuryTokens.map(t => ({
                    target: t,
                    call: [
                        'symbol()(string)'
                    ],
                    returns: [
                        [t + '-symbol']
                    ]
                })))), Multi_Config)
                resolve(balances.results.transformed);
            }else{
                resolve({})
            }
        } catch (e) {
            reject(e)
        }
    })
}

export const createTreasury = async () => {
  return new Promise(async (resolve, reject) => {
    let communityId = null
    try {
      communityId = await getMyCommunityContract()
      if (!communityId) {
        reject(errCode.NO_STAKING_FACTORY)
        return;
      }
    } catch (e) {
      reject(e)
      return
    }
    let contract;
    try {
      contract = await getContract("TreasuryFactory", null, false);
      const tx = await contract.createTreasury(communityId)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      reject(e)
    }
  })
}
