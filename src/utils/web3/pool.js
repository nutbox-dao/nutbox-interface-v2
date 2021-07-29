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
  Multi_Config,
  Transaction_config
} from '@/config'
import {
  waitForTx
} from './ethers'
import {
  createWatcher
} from '@makerdao/multicall'
import {
  getRegitryAssets
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
      reject(e);
      return;
    }

    try {
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
      console.log(235, form.ratios, form.ratios.map(r => parseInt(r * 100)));
      const tx = await contract.addPool(form.assetId, form.name, form.ratios.map(r => parseInt(r * 100)))
      await waitForTx(tx.hash)
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
        const tx = await contract.approve(erc20Handler, new BN(10).pow(new BN(pool.decimal + 50)).toString(), Transaction_config)
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
 * monitor all pool real time data stored in db
 */
export const monitorUserStaked = async () => {
  try {
    const pools = await getAllPools(true)

  } catch (e) {

  }
}

/**
 * monitor users pending rewards
 * @returns 
 */
export const monitorPendingRewards = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      const pools = await getAllPools()
      console.log(6367, pools);
      const watcher = createWatcher(pools.map(p => {
        return {
          target: p.communityId,
          call: [
            'getUserPendingRewards(uint8,address)(uint256)',
            p.pid,
            store.state.web3.account
          ],
          returns: [
            [p.communityId + ':' + p.pid]
          ]
        }
      }), Multi_Config)
      watcher.batch().subscribe(updates => {
        console.log('Updates', updates);
        store.commit('web3/saveLoadingPendingRewards', false)
        let pendingRewards = store.state.web3.pendingRewards
        updates.map(u => {
          pendingRewards[u.type] = u.value
        })
        store.commit('web3/savePendingRewards', {...pendingRewards})
      });
      watcher.start()
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
export const monitorApprovement = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let pools = await getAllPools()
      const erc20HandlerAddress = contractAddress['ERC20AssetHandler']
      pools = pools.filter(pool => pool.type === "HomeChainAssetRegistry")
      const watcher = createWatcher(pools.map(pool => ({
        target: pool.address,
        call: [
          'allowance(address,address)(uint256)',
          store.state.web3.account,
          erc20HandlerAddress
        ],
        returns: [
          [pool.communityId + '-' + pool.pid, val => val / (10 ** pool.decimal) > 1e6]
        ]
      })), Multi_Config)
      watcher.batch().subscribe(updates => {
        console.log('Updates approve', updates);
        store.commit('web3/saveLoadingApprovements', false)
        let approvements = store.state.web3.approvements
        updates.map(u => {
          approvements[u.type] = u.value
        })
        console.log('approvements', approvements);
        store.commit('web3/saveApprovements', {...approvements})
      });
      watcher.start()
      resolve()
    } catch (e) {
      console.log('Monitor approvment fail', e);
      reject()
    }
  })
}
