import BN from "bn.js"
import store from "@/store"
import {
  withdraw as w,
  contribute as c
} from '@/utils/commen/crowdloan'

/**
 * 
 * @param {*} res 
 */
export function loadFunds(res) {
  let funds = [];
  if (!res || res.length === 0) return;
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
  store.commit("kusama/saveClProjectFundInfos", funds);
  store.commit("kusama/saveLoadingFunds", false)
}

export const withdraw = async (paraId, toast, callback) => {
  return await w('kusama', paraId, toast, callback)
}


export const contribute = async (paraId, amount, communityId, trieIndex, toast, callback) => {
  return await c('kusama', paraId, amount, communityId, trieIndex, toast, callback)
}
