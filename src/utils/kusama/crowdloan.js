import {
  u8aConcat,
  u8aToHex,
} from "@polkadot/util"
import {
  blake2AsU8a,
  encodeAddress,
} from "@polkadot/util-crypto"
import BN from "bn.js"
import {
  PARA_STATUS,
} from "@/config"
import store from "../../store"

import { $t } from '../../i18n'

import {
  getApi,
  uni2Token,
  getDecimal,
  getNodeId,
  stanfiAddress
} from './kusama'
import {
  injectAccount
} from './account'
import {
  NumberTo4BytesU8A
} from '../polkadot/utils'

import {
  postContribution
} from '../../apis/api'

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

export const subscribeFundInfo = async (crowdloanCard) => {
  let unsubFund = store.state.kusama.subFund
  if (unsubFund) {
    try{
      unsubFund()
    }catch(e){}
  }else{
    store.commit('kusama/saveLoadingFunds', true)
  }
  let paraId = crowdloanCard.map(c => parseInt(c.para.paraId))
  paraId = [...new Set(paraId)] 
  const api = await getApi()
  try {
    unsubFund = (await api.query.crowdloan.funds.multi(paraId, async (unwrapedFunds) => {
      const bestBlockNumber = (await api.derive.chain.bestNumber()).toNumber()
      const decimal = await getDecimal()
      let funds = []
      for (let i = 0; i < unwrapedFunds.length; i++) {
        const fund = unwrapedFunds[i]
        const pId = paraId[i]
        if (!fund.toJSON()) {
          continue
        }
        console.log('fund',fund.toJSON());
        const unwrapedFund = fund.unwrap()
        const {
          deposit,
          cap,
          depositor,
          end,
          firstSlot,
          lastSlot,
          raised,
          trieIndex
        } = unwrapedFund
        console.log('index', pId, trieIndex.toNumber());
        const childKey = createChildKey(trieIndex)
        const keys = await api.rpc.childstate.getKeys(childKey, '0x')
        const ss58keys = keys.map(k => encodeAddress(k, 0))
        const values = await Promise.all(keys.map(k => api.rpc.childstate.getStorage(childKey, k)))
        const contributions = values.map((v, idx) => ({
          contributor: ss58keys[idx],
          amount: BN(api.createType('(Balance, Vec<u8>)', v.unwrap())[0]),
          memo: api.createType('(Balance, Vec<u8>)', v.unwrap())[1].toHuman()
        }))
        console.log('contri', contributions);
        const [status, statusIndex] = await calStatus(end, firstSlot, raised, cap, pId, bestBlockNumber)
        console.log('contri');
        funds.push({
          paraId: pId,
          status,
          statusIndex,
          deposit: uni2Token(new BN(deposit), decimal),
          cap: new BN(cap),
          depositor,
          end: new BN(end),
          firstSlot: new BN(firstSlot),
          lastSlot: new BN(lastSlot),
          raised: new BN(raised),
          trieIndex,
          funds: contributions
        })
      }
      funds = funds.sort((a, b) => a.statusIndex - b.statusIndex)
      const idsSort = funds.map(f => f.paraId)
      if (funds.length > 0) {
        const  showingcrowdloanCard = crowdloanCard.filter(c => idsSort.indexOf(parseInt(c.para.paraId)) !== -1).sort((a, b) => idsSort.indexOf(parseInt(a.para.paraId)) - idsSort.indexOf(parseInt(b.para.paraId)))
        console.log('fund info', funds);
        store.commit('kusama/saveClProjectFundInfos', funds)
        store.commit('kusama/saveShowingCrowdloan', showingcrowdloanCard)
      } else {
        store.commit('kusama/saveSubFund', null);
      }
      store.commit('kusama/saveLoadingFunds', false)
    }));
    store.commit('kusama/saveSubFund', unsubFund);
  } catch (e) {
    console.error('error', e);
    store.commit('kusama/saveLoadingFunds', false)
  }
}

// 获取当前的status
export const calStatus = async (end, firstSlot, raised, cap, pId, bestBlockNumber) => {
  const api = await getApi()
  const auctionEnd = await getAuctionEnd()
  const leasePeriod = await getLeasePeriod()
  const currentPeriod = Math.floor(bestBlockNumber / leasePeriod)
  const leases = (await api.query.slots.leases(pId)).toJSON()
  const isWinner = leases.length > 0
  const isCapped = (new BN(raised)).gte(new BN(cap))
  const isEnded = bestBlockNumber >= end || bestBlockNumber >= auctionEnd
  const retiring = (isEnded || currentPeriod > firstSlot) && bestBlockNumber < auctionEnd
  let status = ''
  let statusIndex = 0
  if (retiring) {
    status = PARA_STATUS.RETIRED
    statusIndex = 1
  } else {
    if (!(isCapped || isEnded || isWinner) && currentPeriod <= firstSlot) {
      status = PARA_STATUS.ACTIVE
      statusIndex = 0
    } else {
      status = PARA_STATUS.COMPLETED
      statusIndex = 2
    }
  }
  return [status, statusIndex]
}

export const getAuctionEnd = async () => {
  if (store.state.auctionEnd) {
    return store.state.auctionEnd
  }
  const api = await getApi()
  const bestBlockHash = await api.rpc.chain.getBlockHash();
  const auctionInfo = (await api.query.auctions.auctionInfo.at(bestBlockHash)).toJSON();
  const auctionEnd = auctionInfo ? auctionInfo[1] : 0
  store.commit('kusama/saveAuctionEnd', auctionEnd)
  return auctionEnd
}

//  一个租赁周期
export const getLeasePeriod = async () => {
  if (store.state.kusama.clLeasePeriod > 0) {
    return store.state.kusama.clLeasePeriod
  }
  const api = await getApi()
  const leasePeriod = new BN(api.consts.slots.leasePeriod)
  store.commit('kusama/saveClLeasePeriod', leasePeriod)
  return leasePeriod
}

/** memo {
 *     chain: u8,           // 1 bytes chain id
 *     parent: vec<u8, 8>,  // 8 bytes parent node id
 *     child: vec<u8, 8>,   // 8 bytes child node id
 *     height: u32,         // 4 bytes block height of contribute Tx
 *     paraId: u32,         // 4 bytes parachain id
 *     trieIndex: u32,      // 4 bytes of crowdloan fund trie index
 *  }
 */
export function encodeMemo(memo) {
  let buf = new Uint8Array(29);
  buf[0] = memo.chain;
  buf.set(memo.parent, 1);
  buf.set(memo.child, 9);
  buf.set(NumberTo4BytesU8A(memo.height), 17);
  buf.set(NumberTo4BytesU8A(memo.paraId), 21);
  buf.set(NumberTo4BytesU8A(memo.trieIndex), 25);
  return '0x' + Buffer.from(buf).toString('hex');
}

export const withdraw = async (paraId, toast, isInblockCallback) => {
  return new Promise(async (resolve, reject) => {
    const api = await injectAccount(store.state.polkadot.account)
    const from = store.state.polkadot.account?.address
    if (!from) {
      reject('no account')
    }
    const nonce = (await api.query.system.account(from)).nonce.toNumber()
    const unsub = await api.tx.crowdloan.withdraw(from, paraId).signAndSend(from, {
      nonce
    }, ({
      status,
      dispatchError
    }) => {
      if (status.isInBlock || status.isFinalized) {
        if (dispatchError) {
          let errMsg = ''
          if (dispatchError.isModule) {
            // for module errors, we have the section indexed, lookup
            const decoded = api.registry.findMetaError(dispatchError.asModule);
            const {
              documentation,
              name,
              section
            } = decoded;
            errMsg = `${section}.${name}: ${documentation.join(' ')}`
            console.log(`${section}.${name}: ${documentation.join(' ')}`);
          } else {
            // Other, CannotLookup, BadOrigin, no extra info
            console.log(dispatchError.toString());
            errMsg = dispatchError.toString()
          }
          toast(errMsg, {
            title: $t('tip.error'),
            variant: 'danger'
          })
          unsub()
          resolve(false)
        }
      }
      if (status.isBroadcast) {
        if (isInblockCallback) isInblockCallback()
        setTimeout(() => {
          toast($t('transaction.broadcasting'), {
            title: $t('tip.tips'),
            autoHideDelay: 5000,
            variant: 'warning'
          })
        }, 700);
      } else if (status.isInBlock) {
        console.log("Transaction included at blockHash.", status.asInBlock.toJSON());
        toast($t('transaction.inBlock'), {
          title: $t('tip.tips'),
          autoHideDelay: 6000,
          variant: 'warning'
        })
      } else if (status.isFinalized) {
        unsub()
        toast($t('transaction.withdrawOk'), {
          title: $t('tip.success'),
          autoHideDelay: 5000,
          variant: "success",
        });
        // 上传daemon
        resolve(status.asFinalized)
      }
    }).catch((err) => {
      reject(err)
    })
  })
}


export const contribute = async (paraId, amount, communityId, childId, trieIndex, toast, inBlockCallback) => {
  return new Promise(async (resolve, reject) => {
    const from = store.state.polkadot.account && store.state.polkadot.account.address
    communityId = stanfiAddress(communityId, 42)
    childId = stanfiAddress(childId, 42)
    if (!from) {
      reject('no account')
    }
    const api = await injectAccount(store.state.polkadot.account)
    const decimal = await getDecimal()
    paraId = api.createType('Compact<u32>', paraId)
    amount = api.createType('Compact<BalanceOf>', new BN(amount * 1e6).mul(new BN(10).pow(decimal.sub(new BN(6)))))
    const nonce = (await api.query.system.account(from)).nonce.toNumber()
    const contributeTx = api.tx.crowdloan.contribute(paraId, amount, null)
    const memo = {
      chain: 1,
      parent: getNodeId(communityId),
      child: getNodeId(childId),
      height: 0,
      paraId: parseInt(paraId),
      trieIndex: parseInt(trieIndex)
    }
    const encodememo = encodeMemo(memo)
    const memoTx = api.tx.crowdloan.addMemo(paraId, encodememo)
    const unsubContribution = await api.tx.utility
      .batch([contributeTx, memoTx]).signAndSend(from, {
        nonce
      }, ({
        status,
        dispatchError
      }) => {
        if (status.isInBlock || status.isFinalized) {
          if (dispatchError) {
            let errMsg = ''
            if (dispatchError.isModule) {
              // for module errors, we have the section indexed, lookup
              const decoded = api.registry.findMetaError(dispatchError.asModule);
              const {
                documentation,
                name,
                section
              } = decoded;
              errMsg = `${section}.${name}: ${documentation.join(' ')}`
              console.log(`${section}.${name}: ${documentation.join(' ')}`);
            } else {
              // Other, CannotLookup, BadOrigin, no extra info
              console.log(dispatchError.toString());
              errMsg = dispatchError.toString()
            }
            toast(errMsg, {
              title: $t('tip.error'),
              variant: 'danger'
            })
            unsubContribution()
            resolve(false)
          }
        }
        if (status.isBroadcast) {
          if (inBlockCallback) inBlockCallback()
          setTimeout(() => {
            toast($t('transaction.broadcasting'), {
              title: $t('tip.tips'),
              autoHideDelay: 5000,
              variant: 'warning'
            })
          }, 700);
        } else if (status.isInBlock) {
          console.log("Transaction included at blockHash ", status.asInBlock.toJSON());
          const contriHash = status.asInBlock.toJSON()
          console.log({
            relaychain: 'rococo',
            blockHash: contriHash,
            communityId: communityId,
            nominatorId: childId
          });
          // upload to daemon
          try{
            postContribution({
              relaychain: 'rococo',
              blockHash: contriHash,
              communityId: communityId,
              nominatorId: childId
            })
          }catch(e){
            console.error('Upload to daemon fail', e);
          }
          toast($t('transaction.inBlock'), {
            title: $t('tip.tips'),
            autoHideDelay: 6000,
            variant: 'warning'
          })
        } else if (status.isFinalized) {
          unsubContribution()
          toast($t('transaction.contributeOk'), {
            title: $t('tip.tips'),
            autoHideDelay: 5000,
            variant: "success",
          });
          // 添加memo
          // addMemo(communityId, childId, paraId, trieIndex, contriHash)
          resolve(status.isFinalized)
        }
      }).catch(err => {
        reject(err)
      })
  })
}
