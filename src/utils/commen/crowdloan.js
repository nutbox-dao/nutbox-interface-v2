import BN from "bn.js"
import store from "@/store"

import {
  u8aToHex,
} from "@polkadot/util"
import {
  decodeAddress
} from '@polkadot/util-crypto'
import {
  DECIMAL
} from '@/constant'
import {
  $t
} from '@/i18n'

import {
  createCrowdloanRemark,
  createKhalaReferrerRemark
} from './remark'

import {
  stanfiAddress
} from './account'

import {
  handelBlockState
} from './transactionHandler'
import { PARA_STATUS } from '@/config'
import { waitApi } from "./api"
import { createWsEndpoints } from '@polkadot/apps-config';

/**
 * Subscribe all crowdloan only excute one time
 * @param {*} relaychain 
 * @returns 
 */
export const subscribeAllFundInfo = async (relaychain) => {
  let campaigns = store.state[relaychain].campaigns
  if (campaigns) return campaigns;
  const api = await waitApi(relaychain)
  if (!api.query.crowdloan) {
    store.commit(relaychain + '/saveLoadingFunds', false)
    return;
  }
  let endpoints = createWsEndpoints((key, value) => value || key);
  const genesisHash = api.genesisHash.toHex()
  endpoints = endpoints.filter(({ genesisHashRelay }) => genesisHash === genesisHashRelay)
  let paraIds = []
  let tmp = []
  // extract endpoints
  for (let e of endpoints) {
    if (e.paraId && paraIds.indexOf(e.paraId) === -1) {
      paraIds.push(e.paraId)
      tmp.push(e)
    }
  }
  endpoints = tmp
  store.commit(relaychain + '/saveLoadingFunds', true)
  try {
    const unsubFund = (await api.query.crowdloan.funds.multi(paraIds, async (unwrapedFunds) => {
      const bestBlockNumber = (await api.derive.chain.bestNumber()).toNumber()
      let funds = []
      let effectEndpoints = []
      for (let i = 0; i < unwrapedFunds.length; i++) {
        const fund = unwrapedFunds[i]
        const pId = paraIds[i]
        if (!fund.toJSON()) {
          continue
        }
        effectEndpoints.push({
          ...(unwrapedFunds[i].unwrap()),
          ...endpoints[i],
          pId
        })
      }
      const storedFunds = [...store.state[relaychain].clProjectFundInfos]
      funds = await Promise.all(effectEndpoints.map(fund => {
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
          const [status, statusIndex] = await calStatus(relaychain, end, firstPeriod, lastPeriod, raised, cap, pId, bestBlockNumber)
          let contributions = []
          // 如果有缓存，先直接用已经缓存的contribution数据
          if (storedFunds && storedFunds.length > 0) {
            const f = storedFunds.filter(a => a.paraId === pId)
            if (f && f.length > 0) {
              contributions = f[0].funds || []
            }
          }
          res({
            ...fund,
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
        store.commit(relaychain + '/saveClProjectFundInfos', funds)
        // 异步加载投票数据
        handleContributors(relaychain, api, funds)
      } else {
        store.commit(relaychain + '/saveSubFund', null);
      }
      store.commit(relaychain + '/saveLoadingFunds', false)
    }));
    store.commit(relaychain + '/saveSubFund', unsubFund);
  } catch (e) {
    console.log('error', e);
    store.commit(relaychain + '/saveLoadingFunds', false)
  }
}

// Get contribution details
export const handleContributors = async (relaychain, api, funds) => {
  try {
    let account = store.state.polkadot.account?.address
    if (!account) return;
    account = decodeAddress(account)
    account = u8aToHex(account)
    const updateFunds = await Promise.all(funds.map(fund => {
      return new Promise(async (resolve, reject) => {
        const pid = fund.paraId
        // No need to request static data: crowdloan is not active
        if (fund.statusIndex !== 1 && fund.funs && fund.funds.count) {
          resolve(fund)
        }
        const contributions = await api.derive.crowdloan.contributions(pid)
        const own = await  api.derive.crowdloan.ownContributions(pid, [account])
        fund.funds = {
          count: contributions.contributorsHex.length,
          ownContribution: own[account]
        }
        resolve(fund)
      })
    }))
    store.commit(relaychain + '/saveClProjectFundInfos', updateFunds)
  } catch (e) {
    console.log('Handle contributions fail', e);
  }
}

export const withdraw = async (relaychain, paraId, toast, callback) => {
  const api = store.state[relaychain].api
  const from = store.state.polkadot.account?.address
  if (!from) {
    return false
  }
  const nonce = (await api.query.system.account(from)).nonce.toNumber()
  const unsub = await api.tx.crowdloan.withdraw(from, paraId).signAndSend(from, {
    nonce
  }, ({
    status,
    dispatchError
  }) => {
    try {
      handelBlockState(api, status, dispatchError, toast, callback, unsub)
    } catch (e) {
      toast(e.message, {
        title: $t('tip.error'),
        variant: 'danger'
      })
    }
  }).catch((err) => {
    toast(err.message, {
      title: $t('tip.error'),
      variant: 'danger'
    })
    console.log(err);
    return false
  })
}


export const contribute = async (relaychain, paraId, amount, communityId, trieIndex, toast, callback) => {
  const api = await waitApi(relaychain)
  const from = store.state.polkadot.account && store.state.polkadot.account.address
  communityId = stanfiAddress(communityId)
  if (!from) {
    return false
  }
  const decimal = DECIMAL[relaychain]
  paraId = api.createType('Compact<u32>', paraId)
  amount = api.createType('Compact<BalanceOf>', new BN(amount * 1e6).mul(new BN(10).pow(decimal.sub(new BN(6)))))
  const nonce = (await api.query.system.account(from)).nonce.toNumber()
  const contributeTx = api.tx.crowdloan.contribute(paraId, amount, null)
  if (communityId) {
    let trans = []
    const remark = createCrowdloanRemark(api, trieIndex, communityId)
    const remarkTx = api.tx.system.remarkWithEvent(remark)
    trans.push(contributeTx)
    trans.push(remarkTx)

    if (parseInt(paraId) === 2004){
      // 添加phala的remark
      const referrer = api.createType('AccountId', communityId)
      const pid = api.createType('ParaId', 2004)
      const khalaTx = api.tx.system.remarkWithEvent(createKhalaReferrerRemark(api, pid, referrer))
      trans.push(khalaTx)
    }
    const unsub = await api.tx.utility
      .batch(trans).signAndSend(from, {
        nonce
      }, ({
        status,
        dispatchError
      }) => {
        try {
          handelBlockState(api, status, dispatchError, toast, callback, unsub)
        } catch (e) {
          toast(e.message, {
            title: $t('tip.error'),
            variant: 'danger'
          })
        }
      }).catch(err => {
        toast(err.message, {
          title: $t('tip.error'),
          variant: 'danger'
        })
        return false
      })
  }else{ // 没有社区id， 就是官方直接投票，不加remark
    const unsub = await contributeTx.signAndSend(from, {
      nonce
    }, ({
      status,
      dispatchError
    }) => {
      try {
        handelBlockState(api, status, dispatchError, toast, callback, unsub)
      } catch (e) {
        toast(e.message, {
          title: $t('tip.error'),
          variant: 'danger'
        })
      }
    }).catch(err => {
      toast(err.message, {
        title: $t('tip.error'),
        variant: 'danger'
      })
      return false
    })
  }
}



// 获取当前的status
export const calStatus = async (relaychain, end, firstPeriod, lastPeriod, raised, cap, pId, bestBlockNumber) => {
  const api = await waitApi(relaychain)
  // const auctionEnd = await getAuctionEnd(relaychain)
  const leasePeriod = await getLeasePeriod(relaychain)
  const currentPeriod = Math.floor(bestBlockNumber / leasePeriod)
  firstPeriod = firstPeriod.toNumber()
  lastPeriod = lastPeriod.toNumber()
  const leases = (await api.query.slots.leases(pId)).toJSON()
  const isWinner = leases.length > 0
  const isCapped = (new BN(raised)).gte(new BN(cap))
  const isEnded = bestBlockNumber >= end || currentPeriod > firstPeriod
  // const retiring = (isEnded || currentPeriod > firstPeriod) && bestBlockNumber < auctionEnd
  const retiring = bestBlockNumber >= end && !!leasePeriod && (
    isWinner
      ? currentPeriod > lastPeriod
      : currentPeriod > firstPeriod
  ) && !raised.isZero();
  let status = ''
  let statusIndex = 0
  if (retiring) {
    status = PARA_STATUS.RETIRED
    statusIndex = 1
  } else if (isWinner) {
    status = PARA_STATUS.WINNER
    statusIndex = 2
  } else {
    if (!(isCapped || isEnded || isWinner) && currentPeriod <= firstPeriod) {
      status = PARA_STATUS.ACTIVE
      statusIndex = 0
    } else {
      status = PARA_STATUS.COMPLETED
      statusIndex = 3
    }
  }
  return [status, statusIndex]
}

export const getAuctionEnd = async (relaychain) => {
  if (store.state[relaychain].auctionEnd) {
    return store.state[relaychain].auctionEnd
  }
  const api = await waitApi(relaychain)
  const bestBlockHash = await api.rpc.chain.getBlockHash();
  const auctionInfo = (await api.query.auctions.auctionInfo.at(bestBlockHash)).toJSON();
  const auctionEnd = auctionInfo ? auctionInfo[1] : 0
  store.commit(relaychain + '/saveAuctionEnd', auctionEnd)
  return auctionEnd
}

//  一个租赁周期
export const getLeasePeriod = async (relaychain) => {
  if (store.state[relaychain].clLeasePeriod > 0) {
    return store.state[relaychain].clLeasePeriod
  }
  const api = await waitApi(relaychain)
  const leasePeriod = new BN(api.consts.slots.leasePeriod)
  store.commit(relaychain + '/saveClLeasePeriod', leasePeriod)
  return leasePeriod
}

/**
 * Sort pools use status of parachain
 * @param {*} pools crowdloan pools
 * @param {*} parachains all parachains
 */
export const sortCRPoolCard = (pools, parachains) => {
  if (!pools || !parachains) return [];
  const poolsStatus = pools.filter(pool => pool.type === 'SubstrateCrowdloanAssetRegistry').map(pool => {
    const para = parachains.filter(para => pool.chainId === para.chainId && pool.paraId === para.paraId)
    if (para.length === 0){
      return {
        ...pool,
        statusStr: PARA_STATUS.COMPLETED,
        statusIndex: 2
      }
    }else{
      return {
        ...pool,
        statusStr: para[0].statusStr,
        statusIndex: para[0].statusIndex
      }
    }
  })
  return poolsStatus.sort((a, b) => a.statusIndex - b.statusIndex)
}