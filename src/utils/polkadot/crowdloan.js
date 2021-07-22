import {
  u8aConcat,
  u8aToHex,
} from "@polkadot/util"
import {
  blake2AsU8a,
  encodeAddress,
} from "@polkadot/util-crypto"
import BN from "bn.js"
import store from "@/store"

import {
  getApi,
} from './polkadot'
import { withdraw as w, contribute as c, calStatus } from '@/utils/commen/crowdloan'
import { DECIMAL } from '@/constant'

function createChildKey(trieIndex) {
  return u8aToHex(
    u8aConcat(
      ':child_storage:default:',
      blake2AsU8a(
        u8aConcat('crowdloan', trieIndex.toU8a())
      )
    )
  );
}

/**
 * Subscribe crowdloan info from relaychain
 * @param {*} crowdloanCard 
 */
 export const subscribeFundInfo = async (crowdloanCard) => {
  let unsubFund = store.state.polkadot.subFund
  if (unsubFund) {
    try {
      unsubFund()
    } catch (e) {}
  } else {
    store.commit('polkadot/saveLoadingFunds', true)
  }
  let paraId = crowdloanCard.map(c => parseInt(c.paraId))
  paraId = [...new Set(paraId)]
  const api = await getApi()
  try {
    unsubFund = (await api.query.crowdloan.funds.multi(paraId, async (unwrapedFunds) => {
      const bestBlockNumber = (await api.derive.chain.bestNumber()).toNumber()
      let funds = []
      for (let i = 0; i < unwrapedFunds.length; i++) {
        const fund = unwrapedFunds[i]
        const pId = paraId[i]
        if (!fund.toJSON()) {
          continue
        }
        unwrapedFunds[i] = unwrapedFunds[i].unwrap()
        unwrapedFunds[i].pId = pId
      }
      const storedFunds = [...store.state.polkadot.clProjectFundInfos]
      funds = await Promise.all(unwrapedFunds.map(fund => {
        return new Promise(async (res) => {
          const {
            pId,
            cap,
            depositor,
            end,
            firstPeriod,
            lastPeriod,
            raised,
            trieIndex
          } = fund
          const [status, statusIndex] = await calStatus('polkadot', end, firstPeriod, lastPeriod, raised, cap, pId, bestBlockNumber)
          let contributions = []
          // 如果有缓存，先直接用已经缓存的contribution数据
          if (storedFunds && storedFunds.length > 0) {
            const f = storedFunds.filter(a => a.paraId === pId)
            if (f && f.length > 0) {
              contributions = f[0].funds || []
            }
          }
          res({
            paraId: pId,
            status,
            statusIndex,
            cap: new BN(cap),
            depositor,
            end: new BN(end),
            firstPeriod: new BN(firstPeriod),
            lastPeriod: new BN(lastPeriod),
            raised: new BN(raised),
            trieIndex,
            funds: contributions
          })
        })
      }))
      funds = funds.sort((a, b) => a.statusIndex - b.statusIndex)
      if (funds.length > 0) {
        store.commit('polkadot/saveClProjectFundInfos', funds)
        // 异步加载投票数据
        handleContributors(api, funds)
      } else {
        store.commit('polkadot/saveSubFund', null);
      }
      store.commit('polkadot/saveLoadingFunds', false)
    }));
    store.commit('polkadot/saveSubFund', unsubFund);
  } catch (e) {
    console.log('error', e);
    store.commit('polkadot/saveLoadingFunds', false)
  }
}



// Get contribution details
// 此过程最慢，使用异步加载的方式
export const handleContributors = async (api, funds) => {
  try {
    const updateFunds = await Promise.all(funds.map(fund => {
      return new Promise(async (res) => {
        const childKey = createChildKey(fund.trieIndex)
        const keys = await api.rpc.childstate.getKeys(childKey, '0x')
        const ss58keys = keys.map(k => encodeAddress(k, 0))
        const values = await Promise.all(keys.map(k => api.rpc.childstate.getStorage(childKey, k)))
        const contributions = values.map((v, idx) => ({
          contributor: ss58keys[idx],
          amount: BN(api.createType('(Balance, Vec<u8>)', v.unwrap())[0]),
        }))
        fund.funds = contributions || []
        res(fund)
      })
    }))
    store.commit('polkadot/saveClProjectFundInfos', updateFunds)
  } catch (e) {
    console.log(4523, e);
  }
}

/**
 * 
 * @param {*} res 
 */
export function loadFunds(res) {
  let funds = [];
  // 预先展示服务器请求的数据
  for (const fund of res) {
    funds.push({
      paraId: parseInt(fund.paraId),
      status: fund.statusStr,
      statusIndex: fund.statusIndex,
      cap: new BN(fund.cap),
      end: new BN(fund.endBlock),
      firstPeriod: new BN(fund.firstPeriod),
      lastPeriod: new BN(fund.lastPeriod),
      raised: new BN(fund.raised),
      trieIndex: new BN(fund.trieIndex),
      funds: [],
    });
  }
  // 调整显示顺序
  store.commit("polkadot/saveClProjectFundInfos", funds);
  store.commit("polkadot/saveLoadingFunds", false)
  subscribeFundInfo(res)
}

export const withdraw = async (paraId, toast, callback) => {
   await w('polkadot', paraId, toast, callback)
}


export const contribute = async (paraId, amount, communityId, trieIndex, toast, callback) => {
    await c('polkadot', paraId, amount, communityId, trieIndex, toast, callback)
}
