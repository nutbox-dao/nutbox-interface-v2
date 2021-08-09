import {
  getContract,
  contractAddress
} from './contract'
import store from '@/store'
import {
  updatePoolInfo,
  getAllPools as gap,
  getAllParachain as getAP
} from '@/apis/api'
import {
  signMessage
} from './utils'
import {
  errCode,
  Multi_Config
} from '@/config'
import {
  waitForTx
} from './ethers'
import {
  createWatcher
} from '@makerdao/multicall'
import {
  getRegitryAssets,
  getAllTokenFromBackend
} from './asset'
import {
  getMyStakingFactory,
  getNonce
} from './community'
import {
  loadFunds as loadKusamaFunds
} from '../kusama/crowdloan'
import {
  loadFunds as loadPolkadotFunds
} from '../polkadot/crowdloan'
import BN from 'bn.js'


/**
 * Get all pools that user have upload to backend
 * @returns 
 */
export const getAllPools = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const poolsCache = store.state.web3.allPools
    if (!update && poolsCache) {
      resolve(poolsCache)
      return;
    }
    try {
      const allPools = await gap()
      console.log('update all pools', allPools);
      store.commit('web3/saveAllPools', allPools);
      store.commit('web3/saveLoadingAllPools', false)

      resolve(allPools)
    } catch (e) {
      reject(e)
      return
    }
  })
}

/**
 * Get opened pools of community
 * @returns
 */
export const getMyOpenedPools = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    if (!update && store.state.web3.myPools) {
      resolve(store.state.web3.myPools);
      return;
    }
    let stakingFactoryId = null
    try {
      stakingFactoryId = await getMyStakingFactory()
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY);
        return;
      }
    } catch (e) {
      reject(e);
      return;
    }

    let contract;
    try {
      contract = await getContract('StakingTemplate', stakingFactoryId, false);
    } catch (e) {
      store.commit('web3/saveMyPools', [])
      reject(e);
      return;
    }

    try {
      const poolCount = await contract.numberOfPools()
      if (poolCount === 0) {
        console.log('no pools');
        store.commit('web3/saveMyPools', [])
        resolve([])
        return;
      }
      // get active pools
      let pools = await Promise.all((new Array(10).toString().split(',')).map((item, i) => contract.openedPools(i)))
      console.log(3214, pools);
      pools = pools.filter(pool => pool.hasActived)

      try {
        // get pool asset info
        const myAsset = await getRegitryAssets()
        console.log('myasset', myAsset);
        let idToIndex = {}
        myAsset.map((a, i) => idToIndex[a.asset] = i)
        console.log(idToIndex);
        pools = pools.map(pool => ({
          pid: pool.pid,
          poolName: pool.poolName,
          poolRatio: pool.poolRatio,
          stakerCount: pool.stakerCount,
          stakingPair: pool.stakingPair,
          totalStakedAmount: pool.totalStakedAmount,
          asset: myAsset[idToIndex[pool.stakingPair]],
        }))
        store.commit('web3/saveMyPools', pools)
        resolve(pools);
      } catch (e) {
        reject(e);
      }
    } catch (e) {
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
    try {
      stakingFactoryId = await getMyStakingFactory()
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
      contract = await getContract('StakingTemplate', stakingFactoryId, false)
    } catch (e) {
      reject(e);
      return
    }

    try {
      console.log(6236, form.assetId, form.name);
      const tx = await contract.addPool(form.assetId, form.name, form.ratios.map(r => parseInt(r * 100)))
      await waitForTx(tx.hash)
      // re monitor
      resolve(tx.hash)
    } catch (e) {
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
    try {
      stakingFactoryId = await getMyStakingFactory()
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
      contract = await getContract('StakingTemplate', stakingFactoryId, false)
    } catch (e) {
      reject(e);
      return;
    }
    try {
      console.log(form);
      const tx = await contract.setPoolRatios(form.map(val => val * 100))
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      reject(errCode.CONTRACT_CREATE_FAIL)
    }

  })
}


/**
 * Update Pool APY to backend
 * @param {*} pool 
 */
export const updatePoolApy = async (pool, apy) => {
  return new Promise(async (resolve, reject) => {
    let stakingFactoryId = null
    try {
      stakingFactoryId = await getMyStakingFactory()
      if (!stakingFactoryId) {
        reject(errCode.NO_STAKING_FACTORY)
        return;
      }
    } catch (e) {
      reject(e)
      return
    }

    let nonce = await getNonce()
    const userId = store.state.web3.account
    nonce = nonce ? nonce + 1 : 1

    pool['communityId'] = stakingFactoryId;
    pool['pid'] = parseInt(pool.pid)
    pool['stakerCount'] = parseInt(pool.stakerCount)
    pool['totalStakedAmount'] = pool.totalStakedAmount.toString()
    pool['apy'] = apy
    const originMessage = JSON.stringify(pool)
    let signature = ''
    try {
      signature = await signMessage(originMessage + nonce)
    } catch (e) {
      if (e.code === 4001) {
        reject(errCode.USER_CANCEL_SIGNING);
        return;
      }
    }
    const params = {
      userId,
      infoStr: originMessage,
      nonce,
      signature
    }
    try {
      const res = await updatePoolInfo(params)
      // update nonce in storage
      store.commit('web3/saveNonce', nonce)
      resolve(res)
    } catch (e) {
      reject(e)
    }

  })
}

/**
 * Get All parachain from backend
 */
export const getAllParachain = async (update = false) => {
  return new Promise(async (resolve, reject) => {
    const allParachian = store.state.allParachain
    if (!update && allParachian) {
      resolve(allParachian)
      return;
    }
    try {
      const res = await getAP()
      const kusamaCL = res.filter(r => r.chainId === 3)
      const polkadotCL = res.filter(r => r.chainId === 2)
      loadKusamaFunds(kusamaCL)
      // loadPolkadotFunds(polkadotCL)
      store.commit('saveAllParachain', res)
      resolve(res)
    } catch (e) {
      reject(e)
    }
  })
}

/**
 * Approve pool staking token to pool
 * @param {*} pool 
 */
export const approvePool = async (pool) => {
  return new Promise(async (resolve, reject) => {
      let contract;
      try {
        contract = await getContract('ERC20', pool.address, false)
      } catch (e) {
        reject(e);
        return;
      }
     
      const erc20Handler = contractAddress['ERC20AssetHandler']
      try{
        new BN(10).pow(new BN(pool.decimal + 50))
        const tx = await contract.approve(erc20Handler, new BN(10).pow(new BN(pool.decimal + 50)).toString())
        await waitForTx(tx.hash)
        resolve(tx.hash)
      }catch(e){
        if (e.code === 4001){
            reject(errCode.USER_CANCEL_SIGNING)
          }else {
            reject(errCode.BLOCK_CHAIN_ERR)
          }
          console.log('Approve pool Fail', e);
      }
      
  })
}

/**
 * Deposit homechain asset
 * @param {*} communityId  
 * @param {*} pid 
 * @param {*} amount formed amount can directly as a param of contract
 */
export const deposit = async (communityId, pid, amount) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e){
      reject(e)
      return;
    }

    const a = await contract.getUserPendingRewards(0, store.state.web3.account)
    const b = await contract.lastRewardBlock()
    const c = await contract.openedPools(0)
    console.log(235412, a.toString() / 1e18, b.toString(), c);

  

    try{
      console.log('deposit', communityId, pid, amount.toString());
      const tx = await contract.deposit(pid, store.state.web3.account, amount.toString())
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e){
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Deposit Fail', e);
    }
  })
}

/**
 * Withdraw deposit
 * @param {*} communityId 
 * @param {*} pid 
 * @param {*} amount formed amount can directly as a param of contract
 * @returns 
 */
export const withdraw = async (communityId, pid, amount) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e){
      reject(e)
      return;
    }

    try{
      const tx = await contract.withdraw(pid, store.state.web3.account, amount.toString())
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e){
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Deposit Fail', e);
    }
  })
}

/**
 * Withdraw 
 * @param {*} communityId 
 * @param {*} pid 
 */
export const withdrawReward = async (communityId, pid) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e){
      reject(e)
      return;
    }

    try{
      const tx = await contract.withdrawPoolRewards(pid)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e){
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Deposit Fail', e);
    }
  })
}

/** 
 * monitor users staking
 */
export const monitorUserStakings = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pools = await getAllPools()
      store.commit('web3/saveLoadingUserStakings', true)
      let watchers = store.state.web3.watchers
      let watcher = watchers['userStakings']
      watcher && watcher.stop()
      watcher = createWatcher(pools.map(p => {
        return {
          target: p.communityId,
          call: [
            'getUserStakedAmount(uint8,address)(uint256)',
            p.pid,
            store.state.web3.account
          ],
          returns: [
            [p.communityId + '-' + p.pid]
          ]
        }
      }), Multi_Config)
      watcher.batch().subscribe(updates => {
        console.log('Updates user staking', updates);
        store.commit('web3/saveLoadingUserStakings', false)
        let userStakings = store.state.web3.userStakings
        updates.map(u => {
          userStakings[u.type] = u.value
        })
        store.commit('web3/saveUserStakings', {...userStakings})
      });
      watcher.start()
      watchers['userStakings'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('monitorUserStaking fail', e);
      reject()
    }
  })
}

/**
 * monitor users pending rewards
 * @returns 
 */
export const monitorPendingRewards = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pools = await getAllPools()
      store.commit('web3/saveLoadingPendingRewards', true)
      let watchers = store.state.web3.watchers
      let watcher = watchers['pendingRewards']
      watcher && watcher.stop()
      watcher = createWatcher(pools.map(p => ({
          target: p.communityId,
          call: [
            'getUserPendingRewards(uint8,address)(uint256)',
            p.pid,
            store.state.web3.account
          ],
          returns: [
            [p.communityId + '-' + p.pid]
          ]
        })), Multi_Config)
      watcher.batch().subscribe(updates => {
        console.log('Updates pending rewards', updates);
        store.commit('web3/saveLoadingPendingRewards', false)
        let pendingRewards = store.state.web3.pendingRewards
        updates.map(u => {
          pendingRewards[u.type] = u.value
        })
        store.commit('web3/savePendingRewards', {...pendingRewards})
      });
      watcher.start()
      watchers['pendingRewards'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('monitorPendingreward fail', e);
      reject()
    }
  })
}

/**
 * Monitor users token approvement
 * @returns 
 */
export const monitorApprovements = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pools = await getAllPools()
      const erc20HandlerAddress = contractAddress['ERC20AssetHandler']
      pools = pools.filter(pool => pool.type === "HomeChainAssetRegistry")
      store.commit('web3/saveLoadingApprovements', true)
      let watchers = store.state.web3.watchers
      let watcher = watchers['approvements']
      watcher && watcher.stop()
      watcher = createWatcher(pools.map(pool => ({
        target: pool.address,
        call: [
          'allowance(address,address)(uint256)',
          store.state.web3.account,
          erc20HandlerAddress
        ],
        returns: [
          [pool.communityId + '-' + pool.pid, val => val / (10 ** pool.decimal) > 1e10]
        ]
      })), Multi_Config)
      watcher.batch().subscribe(updates => {
        store.commit('web3/saveLoadingApprovements', false)
        let approvements = store.state.web3.approvements
        updates.map(u => {
          approvements[u.type] = u.value
        })
        console.log('Updates approve', approvements);
        store.commit('web3/saveApprovements', {...approvements})
      });
      watcher.start()
      watchers['Updates approve'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('Monitor approvment fail', e);
      reject()
    }
  })
}


/**
 * Monitor all pools tvl
 */
export const monitorPoolTvls = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pools = await getAllPools()
      let watchers = store.state.web3.watchers
      let watcher = watchers['poolTvls']
      watcher && watcher.stop()
      watcher = createWatcher(pools.map(p => {
        return {
          target: p.communityId,
          call: [
            'getPoolTotalStakedAmount(uint8)(uint256)',
            p.pid,
          ],
          returns: [
            [p.communityId + '-' + p.pid]
          ]
        }
      }), Multi_Config)
      watcher.batch().subscribe(updates => {
        console.log('Updates tvl', updates);
        let totalStakings = store.state.web3.totalStakings
        updates.map(u => {
          totalStakings[u.type] = u.value
        })
        store.commit('web3/saveTotalStakings', {...totalStakings})
      });
      watcher.start()
      watchers['poolTvls'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('monitor total stakings fail', e);
      reject()
    }
  })
}

/**
 * Monitor users homechian token balance
 */
export const monitorUserBalances = async () => {
  return new Promise(async (resolve, reject) => {
    try{
      const allTokens = await getAllTokenFromBackend(true)
      store.commit('web3/saveLoadingUserBalances', true)
      let watchers = store.state.web3.watchers
      let watcher = watchers['userBalances']
      watcher && watcher.stop()
      watcher = createWatcher(allTokens.map(token => ({
        target: token.address,
        call:[
          'balanceOf(address)(uint256)',
          store.state.web3.account
        ],
        returns:[
          [token.address]
        ]
      })), Multi_Config)
      watcher.batch().subscribe(updates => {
        let userBalances = store.state.web3.userBalances
        updates.map(u => {
          userBalances[u.type] = u.value
        })
        console.log('Updates balances', userBalances);
        store.commit('web3/saveLoadingUserBalances', false)
        store.commit('web3/saveUserBalances', {...userBalances})
      })
      watcher.start()
      watchers['userBalances'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    }catch(e){
      reject()
    }
  })
}

/**
 * Monitor pools data
 */
export const monitorPools = async () => {
  await Promise.all([
    monitorUserStakings(),
    monitorPendingRewards(),
    monitorApprovements(),
    monitorPoolTvls(),
    monitorUserBalances()
  ]).catch(console.error)
}