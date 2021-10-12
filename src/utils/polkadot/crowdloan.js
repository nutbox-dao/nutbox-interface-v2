import BN from "bn.js"
import store from "@/store"
import { withdraw as w, contribute as c } from '@/utils/commen/crowdloan'
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
}

export const withdraw = async (paraId, toast, callback) => {
   await w('polkadot', paraId, toast, callback)
}


export const contribute = async (paraId, amount, communityId, trieIndex, toast, callback) => {
    await c('polkadot', paraId, amount, communityId, trieIndex, toast, callback)
}
