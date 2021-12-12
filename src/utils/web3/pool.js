import {
  getContract,
  contractAddress
} from './contract'
import store from '@/store'
import {
  updatePoolInfo,
  getAllPools as gap
} from '@/apis/api'
import { getAccounts } from '@/utils/web3/account'
import {
  signMessage
} from './utils'
import {
  errCode,
  Multi_Config,
  OfficialAssets
} from '@/config'
import {
  waitForTx,
  getGasPrice
} from './ethers'
import {
  aggregate,
  createWatcher
} from '@makerdao/multicall'
import {
  getRegitryAssets,
  getAllTokenFromBackend,
  getERC20Info
} from './asset'
import {
  getMyCommunityContract,
  getNonce,
  getAllCommunities
} from './community'
import BN from 'bn.js'
import { GasTimes, NutAddress } from '@/config'
import { ethers } from 'ethers'
import {
  BLOCK_SECOND,
  PRICES_SYMBOL
} from "@/constant"

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
      const currentCommunityId = store.state.currentCommunityId
      const allPools = await gap(currentCommunityId)
      store.commit('web3/saveAllPools', allPools);
      store.commit('web3/saveLoadingAllPools', false)
      // remonitor pools info
      monitorPoolInfos()
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
      stakingFactoryId = await getMyCommunityContract()
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
        store.commit('web3/saveMyPools', [])
        resolve([])
        return;
      }
      // get active pools
      let pools = await Promise.all((new Array(30).toString().split(',')).map((item, i) => contract.openedPools(i)))
      pools = pools.filter(pool => pool.hasActived)

      try {
        // get pool asset info
        let myAsset = await getRegitryAssets()
        myAsset = myAsset.concat(OfficialAssets);
        let idToIndex = {}
        myAsset.map((a, i) => idToIndex[a.asset] = i)
        pools = pools.map(pool => ({
          pid: pool.pid,
          NUT: pool.NUT,
          stakedNUT: pool.stakedNUT,
          poolName: pool.poolName,
          poolRatio: pool.poolRatio,
          stakerCount: pool.stakerCount,
          stakingPair: pool.stakingPair,
          canRemove: pool.canRemove,
          hasRemoved: pool.hasRemoved,
          hasActived: pool.hasActived,
          hasStopped: pool.hasStopped,
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
 * Get info for create a pool
 * Include erc20token info and amount
 * @returns 
 */
export const getStakedNUTInfo = async () => {
  return new Promise(async (resolve, reject) => {
    try{
      const registryHub = await getContract('RegistryHub')
      let NUT = await registryHub.getNUT();
      NUT = await registryHub.getHomeLocation(NUT);
      NUT = await getERC20Info(NUT)
      const stakedNUT = await registryHub.getStakedNUT();
      resolve([NUT, stakedNUT])
    }catch(e) {
      reject(e);
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
      contract = await getContract('StakingTemplate', stakingFactoryId, false)
    } catch (e) {
      reject(e);
      return
    }

    console.log(466, form);

    try {
      const tx = await contract.addPool(form.assetId, form.name, form.ratios.map(r => parseInt(r * 100)))
      await waitForTx(tx.hash)
      // re monitor
      resolve(tx.hash)
    } catch (e) {
      console.log('Create pool fail', e);
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
      contract = await getContract('StakingTemplate', stakingFactoryId, false)
    } catch (e) {
      reject(e);
      return;
    }
    try {
      const tx = await contract.setPoolRatios(form.map(val => val * 100))
      await waitForTx(tx.hash)
      resolve(tx.hash)
    } catch (e) {
      reject(errCode.CONTRACT_CREATE_FAIL)
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

export const approveNUT = async (pool) => {
  return new Promise(async (resolve, reject) => {
    try{
      const res = await approvePool({
        address: NutAddress,
        decimal: 18
      })
      resolve(res)
    }catch(e) {
      reject(e)
    }
  })
}

/**
 * Deposit homechain asset
 * @param {*} communityId  
 * @param {*} pid 
 * @param {*} amount formed amount can directly as a param of contract
 */
export const deposit = async (communityId, pid, amount, boundAccount) => {
  return new Promise(async (resolve, reject) => {
    let contract = {}
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e){
      reject(e)
      return;
    }
    const account = await getAccounts();
    if (!boundAccount){
      boundAccount = ethers.utils.keccak256(account)
    }

    try{
      const tx = await contract.deposit(pid, account, amount.toString(), boundAccount)
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
      const account = await getAccounts();
      const tx = await contract.withdraw(pid, account, amount.toString())
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e){
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
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
      console.log('Withdraw reward Fail', e);
    }
  })
}

/**
 * Stop pool
 * @param {*} pid 
 * @returns 
 */
export const stopPool = async (pid) => {
  return new Promise(async (resolve, reject) => {
    const communityId = store.state.web3.stakingFactoryId
    let contract = null
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e) {
      reject(e)
      return;
    }
    try{
      const tx = await contract.stopPool(pid)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('Stop pool Fail', e);
    }
  })
}

/**
 * tryWithdraw
 * @param {*} pid 
 * @returns 
 */
export const tryWithdraw = async (pid) => {
  return new Promise(async (resolve, reject) => {
    const communityId = store.state.web3.stakingFactoryId
    let contract = null
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e) {
      reject(e)
      return;
    }
    try{
      const tx = await contract.tryWithdraw(pid)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('tryWithdraw pool Fail', e);
    }
  })
}

/**
 * removePool
 * @param {*} pid 
 * @returns 
 */
export const removePool = async (pid) => {
  return new Promise(async (resolve, reject) => {
    const communityId = store.state.web3.stakingFactoryId
    let contract = null
    try{
      contract = await getContract('StakingTemplate', communityId, false)
    }catch(e) {
      reject(e)
      return;
    }
    try{
      const tx = await contract.removePool(pid)
      await waitForTx(tx.hash)
      resolve(tx.hash)
    }catch(e) {
      if (e.code === 4001){
        reject(errCode.USER_CANCEL_SIGNING)
      }else {
        reject(errCode.BLOCK_CHAIN_ERR)
      }
      console.log('RemovePool pool Fail', e);
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
      const account = await getAccounts();
      watcher = createWatcher(pools.map(p => {
        return {
          target: p.communityId,
          call: [
            'getUserStakedAmount(uint8,address)(uint256)',
            p.pid,
            account
          ],
          returns: [
            [p.communityId + '-' + p.pid]
          ]
        }
      }), Multi_Config)
      watcher.batch().subscribe(updates => {
        // console.log('Updates user staking', updates);
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
      reject(e)
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
      const account = await getAccounts();
      watcher = createWatcher(pools.map(p => ({
          target: p.communityId,
          call: [
            'getUserPendingRewards(uint8,address)(uint256)',
            p.pid,
            account
          ],
          returns: [
            [p.communityId + '-' + p.pid]
          ]
        })), Multi_Config)
      watcher.batch().subscribe(updates => {
        // console.log('Updates pending rewards', updates);
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
      reject(e)
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
      const account = await getAccounts();
      let calls = pools.map(pool => ({
        target: pool.address,
        call: [
          'allowance(address,address)(uint256)',
          account,
          erc20HandlerAddress
        ],
        returns: [
          [pool.communityId + '-' + pool.pid, val => val / (10 ** pool.decimal) > 1e10]
        ]
      }))
      calls.push({
        target: NutAddress,
        call: [
          'allowance(address,address)(uint256)',
          account,
          erc20HandlerAddress
        ],
        returns: [
          ['NUTAllowance', val => val / (1e18) > 1e10]
        ]
      })
      watcher = createWatcher(calls, Multi_Config)
      watcher.batch().subscribe(updates => {
        store.commit('web3/saveLoadingApprovements', false)
        let approvements = store.state.web3.approvements
        updates.map(u => {
          approvements[u.type] = u.value
        })
        // console.log('Updates approve', approvements);
        store.commit('web3/saveApprovements', {...approvements})
      });
      watcher.start()
      watchers['Updates approve'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('Monitor approvment fail', e);
      reject(e)
    }
  })
}

/**
 * Monitor all pools info
 */
export const monitorPoolInfos = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pools = await getAllPools()
      let watchers = store.state.web3.watchers
      let watcher = watchers['poolInfos']
      watcher && watcher.stop()
      watcher = createWatcher(pools.map(p => {
        return {
          target: p.communityId,
          call: [
            'openedPools(uint256)(uint8,bytes32,uint256,uint64,string,bool,bool,bool,bool,uint16,bytes32,uint256,uint256)',
            p.pid,
          ],
          returns: [
            [p.communityId + '-' + p.pid + "-pid", pid => parseInt(pid)],
            [p.communityId + '-' + p.pid + "-NUT"],
            [p.communityId + '-' + p.pid + "-stakedNUT", val => val.toString() / 1e18],
            [p.communityId + '-' + p.pid + "-stakerCount", count => parseInt(count)],
            [p.communityId + '-' + p.pid + "-poolName"],
            [p.communityId + '-' + p.pid + "-hasActived"],
            [p.communityId + '-' + p.pid + "-hasStopped"],
            [p.communityId + '-' + p.pid + "-canRemove"],
            [p.communityId + '-' + p.pid + "-hasRemoved"],
            [p.communityId + '-' + p.pid + "-poolRatio", ratio => parseInt(ratio)],
            [p.communityId + '-' + p.pid + "-stakingPair"],
            [p.communityId + '-' + p.pid + "-shareAcc"],
            [p.communityId + '-' + p.pid + "-totalStakedAmount", amount => amount.toString()]
          ]
        }
      }), Multi_Config)
      watcher.batch().subscribe(updates => {
        // console.log('update pools info', updates);
        let monitorPools = store.state.web3.monitorPools 
        updates.map(u => {
          monitorPools[u.type] = u.value
        })
        store.commit('web3/saveMonitorPools', {...monitorPools})
      });
      watcher.start()
      watchers['poolInfos'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    } catch (e) {
      console.log('monitor pools info fail', e);
      reject(e)
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
      const account = await getAccounts();
      watcher = createWatcher(allTokens.map(token => ({
        target: token.address,
        call:[
          'balanceOf(address)(uint256)',
          account
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
        // console.log('Updates balances', userBalances);
        store.commit('web3/saveLoadingUserBalances', false)
        store.commit('web3/saveUserBalances', {...userBalances})
      })
      watcher.start()
      watchers['userBalances'] = watcher
      store.commit('web3/saveWatchers', {...watchers})
      resolve()
    }catch(e){
      reject(e)
    }
  })
}


/**
 * Monitor pools apy by polling
 */
 export const UpdateApysOfPool = async () => {
  // apy calculate:
  // need token price, ctoken price, poolRatio, devRatio, currentblockreward, tvl
  // a pool's apy = a year's reward / tvl
  // = currenReward * a years block * poolRatio / 10000 * (1 - devRatio) * ctoken price / (tvl * token Price)
  // if tvl = 0 => apy = 0
  // token price = 0 or ctoken price = 0 => apy = 0
  const update = async () => {
    try{
      let price = store.state.prices
      let [pools, communities] = await Promise.all([getAllPools(), getAllCommunities()])
      const monitorPools = store.state.web3.monitorPools
      let temp = {}
      for (let c of communities) {
        temp[c.id] = c
      }
      communities = temp
      const blocksPerYear = 365 * 24 * 60 * 60 / BLOCK_SECOND
      const vestsToSteem = store.state.steem.vestsToSteem
      const vestsToHive = store.state.hive.vestsToHive
      for (let pool of pools){
        const key = pool.communityId + '-' + pool.pid + '-'
        const tvl = monitorPools[key + 'totalStakedAmount']
        const poolRatio = monitorPools[key + 'poolRatio']
        if (monitorPools[key + 'hasStopped']) continue
        if (monitorPools[key + 'hasRemoved']) continue
        if (tvl === '0') continue;
        if (poolRatio === 0) continue;
        const com = communities[pool.communityId]
        let ctokenDecimal = pool.decimal ?? 18;
        let decimal = pool.tokenDecimal ?? 18;
        ctokenDecimal = 10 ** ctokenDecimal;
        decimal = 10 ** decimal;
        
        if (!com) continue;
        const ctokenAddress = com.ctoken
        const ctokenPrice = price[ctokenAddress]
        if (ctokenPrice === 0) continue;
        const devRatio = com.rewardRatio
        const rewardPerBlock = com.rewardPerBlock
        if (pool.type === 'HomeChainAssetRegistry'){
          const p = price[pool.address]
          if (p === 0){
            continue
          }          
          //currenReward * a years block * poolRatio / 10000 * (1 - devRatio) * ctoken price / (tvl * token Price)
          pool.apy = blocksPerYear * (rewardPerBlock / ctokenDecimal) * (poolRatio / 10000) * (1 - devRatio / 10000) * ctokenPrice / (tvl / decimal * p)
          pool.apy = 100 * pool.apy;
          continue;
        }
        if (pool.type === 'SteemHiveDelegateAssetRegistry' && pool.assetType === 'sp'){
          const steemPrice = parseFloat(price['STEEMETH']) * parseFloat(price['ETHUSDT'])
          pool.apy = blocksPerYear * (rewardPerBlock / ctokenDecimal) * (poolRatio / 10000) * (1 - devRatio / 10000) * ctokenPrice / (tvl / 1e6 * vestsToSteem * steemPrice)
          pool.apy = pool.apy * 100;
          continue;
        }
        if (pool.type === 'SteemHiveDelegateAssetRegistry' && pool.assetType === 'hp'){
          const hivePrice = parseFloat(price['HIVUSDT'])
          pool.apy = blocksPerYear * (rewardPerBlock / ctokenDecimal) * (poolRatio / 10000) * (1 - devRatio / 10000) * ctokenPrice / (tvl / 1e6 * vestsToHive * hivePrice)
          pool.apy = 100 * pool.apy;
          continue;
        }
      }
      store.commit('web3/saveAllPools', [...pools])
    }catch(e) {
      console.log('Update apys faile', e);
    }
    setTimeout(update, 10000)
  }
  update()
}

/**
 * Monitor pools data
 */
export const monitorPools = async () => {
  getAllPools().then(() => {
    Promise.all([
      monitorUserStakings(),
      monitorPendingRewards(),
      monitorApprovements(),
      monitorPoolInfos(),
      monitorUserBalances()
    ]).catch(console.error)
  })
}