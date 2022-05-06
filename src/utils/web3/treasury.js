import {
  getContract
} from './contract'
import store from '@/store'
import {
  errCode,
  Multi_Config
} from '@/config'
import {
  waitForTx
} from './ethers'
import {
  aggregate
} from '@makerdao/multicall'
import {
  getMyCommunityContract
} from './community'
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
                })).concat(treasuryTokens.map(t => ({
                  target: t,
                  call: [
                      'symbol()(string)'
                  ],
                  returns: [
                      [t + '-symbol']
                  ]
              }))), Multi_Config)
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
      contract.on('NewTreasuryCreated', (community, treasury) => {
        if (community.toLowerCase() === communityId.toLowerCase()) {
          resolve(treasury)
        }
      })
      await contract.createTreasury(communityId)
    } catch (e) {
      reject(e)
    }
  })
}

export const redeem = async (treasury, amount) => {
  return new Promise(async (resolve, reject) => {
    try{
      const contract = await getContract('Treasury', treasury, false)
      const tx = await contract.redeem(ethers.utils.parseUnits(amount.toString(), 18))
      await waitForTx(tx.hash)
      resolve();
    }catch(e) {
      reject(e)
    }
  })
}

export const getApprovement = async (treasury, ctoken) => {
  return new Promise(async (resolve, reject) => {
    try{
      
    }catch(e) {

    }
  })
}
