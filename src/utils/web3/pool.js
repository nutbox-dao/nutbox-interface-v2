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
  getAllTokenFromBackend
} from './asset'
import {
  getMyCommunityContract,
  getAllCommunities,
  getOperationFee
} from './community'
import BN from 'bn.js'
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

import {
  accBech32ToAddress,
  addressAccToAccBech32
} from "@/utils/cosmos/cosmos";

export const getPoolFactoryAddress = (type) => {
  switch (type) {
    case 'erc20staking':
      return contractAddress['ERC20StakingFactory'].toLowerCase()
    case 'steem', 'steem-witness':
      return contractAddress['SPStakingFactory'].toLowerCase()
    case 'hive':
      return contractAddress['SPStakingFactory'].toLowerCase()
    case 'cosmos':
      return contractAddress['CosmosStakingFactory'].toLowerCase()
    case 'atom':
      return contractAddress['CosmosStakingFactory'].toLowerCase()
    case 'juno':
      return contractAddress['CosmosStakingFactory'].toLowerCase()
  }
}

export const getPoolType = (factory, chainId) => {
  if (!factory) return '';
  factory = ethers.utils.getAddress(factory)
  switch (factory) {
    case contractAddress['ERC20StakingFactory']:
      return 'erc20staking'
    case contractAddress['SPStakingFactory']: {
      if (parseInt(chainId) === 1) {
        return 'steem'
      } else if (parseInt(chainId) === 2) {
        return 'hive'
      } else if (parseInt(chainId) === 6) {
        return 'steem-witness'
      }
    }
    case contractAddress['CosmosStakingFactory']: {
      if (parseInt(chainId) === 3) {
        return 'atom'
      }else if(parseInt(chainId) === 4) {
        return 'osmo'
      }else if(parseInt(chainId) === 5) {
        return 'juno'
      }
    }
  }
}

/**
 * Approve pool staking token to pool
 * @param {*} pool 
 */
export const approvePool = async (pool) => {
  return new Promise(async (resolve, reject) => {
    let contract;
    try {
      contract = await getContract('ERC20', pool.asset, false)
    } catch (e) {
      reject(e);
      return;
    }

    try {
      const tx = await contract.approve(pool.id, new BN(10).pow(new BN(60)).toString(), {
        gasLimit: 75402
      })
      await waitForTx(tx.hash);
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      } else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Approve pool Fail', e);
    }

  })
}

export const approveNUT = async (pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      const res = await approvePool({
        address: NutAddress,
        decimal: 18
      })
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Add new pool
 * @param {Object} form {name, ratios, type, asset}
 */
export const addPool = async (form) => {
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
    let contract;
    let factory;
    try {
      contract = await getContract('Community', stakingFactoryId, false)
      factory = await getContract(getPoolTypeName(form.type))
    } catch (e) {
      reject(e);
      return
    }

    try {
      if (form.type === 'erc20staking') {
        factory.on('ERC20StakingCreated', (pool, community, name, token) => {
          if (community.toLowerCase() == stakingFactoryId.toLowerCase() && name === form.name) {
            console.log('Create a new pool:', pool);
            const newPool = {
              id: ethers.utils.getAddress(pool),
              status: 'OPENED',
              name,
              asset: form.asset,
              poolFactory: getPoolFactory(form.type),
              ratio: form.ratios[form.ratios.length - 1] * 100,
              chainId: 0,
              stakersCount: 0,
              totalAmount: 0,
              hasCreateGauge: 0,
              votersCount: 0,
              votedAmount:0
            }
            resolve(newPool)
            factory.removeAllListeners('ERC20StakingCreated')
          }
        })
      } else if(form.type === 'steem' || form.type === 'hive' || from.type === 'steem-witness') {
        factory.on('SPStakingCreated', (pool, community, name, chainId, delegatee) => {
          if (community.toLowerCase() == stakingFactoryId.toLowerCase() && name === form.name) {
            console.log('Create a new pool:', pool);
            const newPool = {
              id: ethers.utils.getAddress(pool),
              status: 'OPENED',
              name,
              asset: '0x' + form.asset.substring(4),
              poolFactory: getPoolFactory(form.type),
              ratio: form.ratios[form.ratios.length - 1] * 100,
              chainId,
              stakersCount: 0,
              totalAmount: 0,
              hasCreateGauge: 0,
              votersCount: 0,
              votedAmount:0
            }
            resolve(newPool)
            factory.removeAllListeners('SPStakingCreated')
          }
        })
      } else if(form.type === 'atom' || form.type === 'osmo' || form.type === 'juno') {
        factory.on('CosmosStakingCreated', (pool, community, name, chainId, delegatee) => {
          if (community.toLowerCase() == stakingFactoryId.toLowerCase() && name === form.name) {
            console.log('Create a new pool:', pool);
            const newPool = {
              id: ethers.utils.getAddress(pool),
              status: 'OPENED',
              name,
              asset: '0x' + form.asset.substring(4),
              poolFactory: getPoolFactory(form.type),
              ratio: form.ratios[form.ratios.length - 1] * 100,
              chainId,
              stakersCount: 0,
              totalAmount: 0,
              hasCreateGauge: 0,
              votersCount: 0,
              votedAmount:0
            }
            resolve(newPool)
            factory.removeAllListeners('CosmosStakingCreated')
          }
        })
      }
      const tx = await contract.adminAddPool(form.name, form.ratios.map(r => parseInt(r * 100)), getPoolFactory(form.type), form.asset)
      await waitForTx(tx.hash)
    } catch (e) {
      console.log('Create pool fail', e);
      if (form.type === 'erc20staking') {
        factory.removeAllListeners('ERC20StakingCreated')
      } else if(form.type === 'steem' || form.type === 'hive' || form.type === 'steem-witness') {
        factory.removeAllListeners('SPStakingCreated')
      } else if(form.type === 'atom' || form.type === 'osmo' || form.type === 'juno') {
        factory.removeAllListeners('CosmosStakingCreated')
      }
      reject(errCode.BLOCK_CHAIN_ERR)
    }
  })
}

/**
 * Update Pools ratios
 * @param {Array} form ratios array
 * @returns 
 */
export const updatePoolsRatio = async (form) => {
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
    let contract;
    try {
      contract = await getContract('Community', stakingFactoryId, false)
    } catch (e) {
      reject(e);
      return;
    }
    try {
      const tx = await contract.adminSetPoolRatios(form.map(val => parseInt(val * 100)))
      console.log('Update pool ratios', tx.hash);
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      console.log(e);
      reject(errCode.BLOCK_CHAIN_ERR)
    }

  })
}

/**
 * Remove Pool
 * Can't be reopened if do this operation
 * @param {Object} form {poolAddress,activedPools,ratios} 
 * @returns 
 */
export const closePool = async (form) => {
  return new Promise(async (resolve, reject) => {
    const communityId = store.state.web3.stakingFactoryId
    let contract = null
    try {
      contract = await getContract('Community', communityId, false)
    } catch (e) {
      reject(e)
      return;
    }
    try {
      const tx = await contract.adminClosePool(form.poolAddress, form.activedPools, form.ratios)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      } else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Close pool Fail', e);
    }
  })
}

/**
 * Deposit homechain asset
 * @param {*} poolId
 * @param {*} amount
 */
export const deposit = async (poolId, amount) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try {
      contract = await getContract('ERC20Staking', poolId, false)
    } catch (e) {
      reject(e)
      return;
    }

    try {
      const tx = await contract.deposit(ethers.utils.parseUnits(amount.toString(), 18))
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      } else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Deposit Fail', e);
    }
  })
}

/**
 * Withdraw 
 * @param {*} poolId 
 * @param {*} amount
 * @returns 
 */
export const withdraw = async (poolId, amount) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try {
      contract = await getContract('ERC20Staking', poolId, false)
    } catch (e) {
      reject(e)
      return;
    }

    try {
      const tx = await contract.withdraw(ethers.utils.parseUnits(amount.toString(), 18))
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      } else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Withdraw Fail', e);
    }
  })
}

/**
 * Withdraw 
 * @param {*} communityId 
 * @param {*} pid 
 */
export const withdrawReward = async (communityId, poolId) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try {
      contract = await getContract('Community', communityId, false)
    } catch (e) {
      reject(e)
      return;
    }

    try {
      const tx = await contract.withdrawPoolsRewards([poolId])
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING)
      } else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Withdraw reward Fail', e);
    }
  })
}

// get user's bind account of steem / hive
// account: EVM
// bindAccount: POS chain account
export const getBindSteemAccount = async (pool) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getContract('SPStaking', pool.id)
      const account = await getAccounts();
      const bindAccount = parseInt(pool.chainId) === 1 ? store.state.steem.steemAccount : store.state.hive.hiveAccount;
      const bindAccountBytes = ethers.utils.formatBytes32String(bindAccount);
      const [accountInfo, _account] = await Promise.all([contract.getUserDepositInfo(account), contract.accountBindMap(bindAccountBytes)])
      const _bindAccount = ethers.utils.parseBytes32String(accountInfo.bindAccount);
      resolve({
        account: [account, _bindAccount],
        bindAccount: [bindAccount, _account]
      })
    } catch (e) {
      reject(e);
    }
  })
}

// get user's bind account of cosmos
// account: EVM
// bindAccount: POS chain account
export const getBindCosmosAccount = async (pool, type) => {
  return new Promise(async (resolve, reject) => {
    try {
      const contract = await getContract('CosmosStaking', pool.id)
      const account = await getAccounts();
      let bindAccount;
      if (type === 'atom') {
        bindAccount = store.state.cosmos.cosmosAccount;
      }else if(type === 'osmo') {
        bindAccount = store.state.osmosis.osmosisAccount;
      }else if (type === 'juno') {
        bindAccount = store.state.juno.junoAccount;
      }
      
      const bindAccountBytes = accBech32ToAddress(bindAccount, type);
      const [accountInfo, _account] = await Promise.all([contract.getUserDepositInfo(account), contract.accountBindMap(bindAccountBytes)])
      const _bindAccount = addressAccToAccBech32(accountInfo.bindAccount, type);
      resolve({
        account: [account, _bindAccount],
        bindAccount: [bindAccount, _account]
      })
    } catch (e) {
      reject(e);
    }
  })
}

/**
 * update pools info
 * @param {*} pools 
 * @returns 
 */
export const updatePoolsByPolling = (pools) => {
  const polling = rollingFunction(getPoolStakingInfo, pools, 6, res => {
    let staked = {}
    let total = {}
    let pending = {}
    let approve = {}
    for (let d in res) {
      const [type, pid] = d.split('-')
      if (type === 'staked') {
        staked[pid] = res[d]
      } else if (type === 'total') {
        total[pid] = res[d]
      } else if (type === 'pending') {
        pending[pid] = res[d]
      } else if (type === 'approve') {
        approve[pid] = res[d]
      }
    }
    store.commit('pool/saveUserStaked', staked || {})
    store.commit('pool/saveTotalStaked', total || {})
    store.commit('pool/saveUserReward', pending || {})
    store.commit('pool/saveApprovements', approve || {})
  })
  // const stakingRolling = rollingFunction(getUserStakings, pools, 5, res => {
  //   console.log(46325,res);
  //   store.commit('pool/saveUserStaked', res || {})
  // })
  // const totalStakingRolling = rollingFunction(getPoolTotalStakings, pools, 8, res => {
  //   store.commit('pool/saveTotalStaked', res || {})
  // })
  // const rewardRolling = rollingFunction(getPendingRewards, pools, 3, res => {
  //   store.commit('pool/saveUserReward', res || {})
  // })
  // store.commit('pool/saveLoadingApprovements', true)
  // const approvmentRolling = rollingFunction(getApprovements, pools, 5, res => {
  //   store.commit('pool/saveApprovements', res || {})
  // })
  // stakingRolling.start();
  // totalStakingRolling.start();
  // rewardRolling.start();
  // approvmentRolling.start();
  polling.start();

  return polling;
}

// get pools' stake,totalstake,reward,approvement info
const getPoolStakingInfo = async (pools) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await getAccounts();
      if (!account) {
        resolve();
        return;
      }
      let calls = []
      for (let i = 0; i < pools.length; i++) {
        const p = pools[i]
        calls.push({
          target: p.id,
          call: [
            'getUserStakedAmount(address)(uint256)',
            account
          ],
          returns: [
            ['staked-' + p.id]
          ]
        });
        calls.push({
          target: p.id,
          call: [
            'getTotalStakedAmount()(uint256)'
          ],
          returns: [
            ['total-' + p.id]
          ]
        });
        calls.push({
          target: p.community.id,
          call: [
            'getPoolPendingRewards(address,address)(uint256)',
            p.id,
            account
          ],
          returns: [
            ['pending-' + p.id]
          ]
        });
        if (p.poolFactory.toLowerCase() === getPoolFactoryAddress('erc20staking')) {
          calls.push({
            target: p.asset,
            call: [
              'allowance(address,address)(uint256)',
              account,
              p.id
            ],
            returns: [
              ['approve-' + p.id, val => val.toString() / (10 ** store.getters['web3/tokenDecimals'](p.asset)) > 1e12]
            ]
          })
        }
      }
      const result = await aggregate(calls, Multi_Config)
      resolve(result.results.transformed)
    } catch (e) {
      console.log("Get user's staking info fail");
      reject(e)
    }
  })
}

/** 
 * Get users staking
 */
export const getUserStakings = async (pools) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await getAccounts();
      if (!account) {
        resolve();
        return;
      }
      const result = await aggregate(pools.map(p => {
        return {
          target: p.id,
          call: [
            'getUserStakedAmount(address)(uint256)',
            account
          ],
          returns: [
            [p.id]
          ]
        }
      }), Multi_Config)
      resolve(result.results.transformed)
    } catch (e) {
      console.log('Get UserStaking fail', e);
      reject(e)
    }
  })
}

/** 
 * Get pool total staked
 */
export const getPoolTotalStakings = async (pools) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await aggregate(pools.map(p => {
        return {
          target: p.id,
          call: [
            'getTotalStakedAmount()(uint256)'
          ],
          returns: [
            [p.id]
          ]
        }
      }), Multi_Config)
      resolve(result.results.transformed)
    } catch (e) {
      console.log('Get pool total fail', e);
      reject(e)
    }
  })
}

/**
 * Get users pending rewards
 * @returns 
 */
export const getPendingRewards = async (pools) => {
  return new Promise(async (resolve, reject) => {
    try {
      const account = await getAccounts();
      if (!account) {
        resolve()
        return
      }
      const result = await aggregate(pools.map(p => ({
        target: p.community.id,
        call: [
          'getPoolPendingRewards(address,address)(uint256)',
          p.id,
          account
        ],
        returns: [
          [p.id]
        ]
      })), Multi_Config)
      resolve(result.results.transformed)
    } catch (e) {
      console.log('Get Pendingreward fail', e);
      reject(e)
    }
  })
}

/**
 * Get users token approvement
 * @returns 
 */
export const getApprovements = async (pools) => {
  return new Promise(async (resolve, reject) => {
    try {
      pools = pools.filter(p => p.poolFactory.toLowerCase() === getPoolFactoryAddress('erc20staking'))
      const account = await getAccounts();
      if (!account) {
        resolve();
        return
      }
      let calls = pools.map(pool => ({
        target: pool.asset,
        call: [
          'allowance(address,address)(uint256)',
          account,
          pool.id
        ],
        returns: [
          [pool.id, val => val.toString() / (10 ** store.getters['web3/tokenDecimals'](pool.asset)) > 1e12]
        ]
      }))
      const result = await aggregate(calls, Multi_Config)
      resolve(result.results.transformed)
    } catch (e) {
      console.log('Get approvment fail', e);
      reject(e)
    } finally {
      store.commit('pool/saveLoadingApprovements', false)
    }
  })
}

/**
 * Monitor users homechian token balance
 */
export const monitorUserBalances = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allTokens = await getAllTokenFromBackend()
      store.commit('web3/saveLoadingUserBalances', true)
      let watchers = store.state.web3.watchers
      let watcher = watchers['userBalances']
      watcher && watcher.stop()
      const account = await getAccounts();
      if (!account) {
        resolve()
        return;
      }
      watcher = createWatcher(allTokens.map(token => ({
        target: token.address,
        call: [
          'balanceOf(address)(uint256)',
          account
        ],
        returns: [
          [token.address]
        ]
      })), Multi_Config)
      watcher.batch().subscribe(updates => {
        let userBalances = store.state.web3.userBalances
        updates.map(u => {
          userBalances[u.type] = u.value
        })
        // console.log('Updates balances', userBalances);
        store.commit('web3/saveLoadingUserBalances', false)
        store.commit('web3/saveUserBalances', {
          ...userBalances
        })
      })
      watcher.start()
      watchers['userBalances'] = watcher
      store.commit('web3/saveWatchers', {
        ...watchers
      })
      resolve()
    } catch (e) {
      reject(e)
    }
  })
}
