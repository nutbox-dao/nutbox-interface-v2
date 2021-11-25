
import { errCode, STEEM_GAS_ACCOUNT, STEEM_STAKE_FEE, BSC_CHAIN_ID } from '../../config.js'
import store from '@/store'
import axios from "axios"

function requestBroadcastWithFee (account, stakingFeast, pid, address, fee, symbol, operation, needsActive = true) {
  const steemGas = STEEM_GAS_ACCOUNT
  let memo = [
    "delegate_vesting_shares",
    {
      "homeChainId": BSC_CHAIN_ID, // ethruem chain id
      "stakingFeast": stakingFeast,
      "pid": pid,
      "delegator_address": address,
    }
  ]
  memo = JSON.stringify(memo)
  const feeOperation = [
    'transfer',
    {
      from: account,
      to: steemGas,
      amount: fee + ' ' + symbol,
      memo
    }
  ]
  return broadcastOps([feeOperation, operation])
}

export async function transferSteem (from, to, amount, memo) {
  amount = parseFloat(amount).toFixed(3)
  const transOp = [
    'transfer',
    {
      from,
      to,
      amount: amount + ' STEEM',
      memo
    }
  ]
  return await broadcastOps([transOp])
}

// export async function steemWrap (from, to, amount, memo, currency, address, fee) {
//   fee = parseFloat(fee).toFixed(3)
//   amount = parseFloat(amount).toFixed(3)
//   return await requestBroadcastWithFee(from, address, fee, currency, [
//     'transfer',
//     {
//       from,
//       to,
//       amount: amount + ' ' + currency,
//       memo
//     }
//   ])
// }

export async function steemDelegation (delegator, delegatee, amount, stakingFeast, pid, address) {
  const fee = parseFloat(STEEM_STAKE_FEE || 1).toFixed(3)
  return await requestBroadcastWithFee(delegator, stakingFeast, pid, address, fee, 'STEEM', [
    'delegate_vesting_shares',
    {
      delegator,
      delegatee,
      vesting_shares: amount + ' ' + 'VESTS'
    }
  ])
}

export async function steemTransferVest (from, to, amount, address, fee) {
  fee = parseFloat(fee).toFixed(3)
  const steemGas = STEEM_GAS_ACCOUNT
  const feeOperation = [
    'transfer',
    {
      from,
      to: steemGas,
      amount: fee + ' ' + 'STEEM',
      memo: 'fee: ' + 'transfer_to_vesting' + ' ' + address
    }
  ]
  const transferVestOp = [
    'transfer_to_vesting',
    {
      from,
      to,
      amount: amount + ' STEEM'
    }
  ]
  return await broadcastOps([feeOperation, transferVestOp])
}

export async function getGlobalProperties () {
  return new Promise(async (resolve, reject) => {
    axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"database_api.get_dynamic_global_properties", "id":1}').then(res => {
    if (res.data.result)  
      resolve(res.data.result)
    else
      reject();
    }).catch(err => {
      console.log('Get steem global data fail:', err)
      reject(err)
    })
  })
}

export async function steemToVest (steemPower) {
  const props = await getGlobalProperties()
  const totalSteem = Number(props.total_vesting_fund_steem.amount) / (10 ** props.total_vesting_fund_steem.precision)
  const totalVests = Number(props.total_vesting_shares.amount) / (10 ** props.total_vesting_shares.precision)
  return ((parseFloat(steemPower) * totalVests) / totalSteem).toFixed(6)
}

export async function vestsToSteem (vests) {
  const props = await getGlobalProperties()
  const totalSteem = Number(props.total_vesting_fund_steem.amount) / (10 ** props.total_vesting_fund_steem.precision)
  const totalVests = Number(props.total_vesting_shares.amount) / (10 ** props.total_vesting_shares.precision)
  return ((parseFloat(vests) * totalSteem) / totalVests)
}

export const getAccountInfo = async (account) => {
  return new Promise((resolve, reject) => {
    axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["' + account +'"]], "id":1}').then(res => {
      if (res.data.result)
        resolve(res.data.result[0])
      else
        reject()
    }).catch(err => {
      console.log('Get steem account data fail:', err)
      reject(err)
    })

  })
}

export const getSteemBalance = async (username) => {
  const accountInfo = await getAccountInfo(username)
  return parseFloat(accountInfo.balance)
}

export const getSbdBalance = async (username) => {
  const accountInfo = await getAccountInfo(username)
  return parseFloat(accountInfo.sbd_balance)
}

export const getVestingShares = async (username) => {
  const account = await getAccountInfo(username)
  const staked = parseFloat(account.vesting_shares)
  const delegated = parseFloat(account.delegated_vesting_shares)
  return staked - delegated
}

export const getDelegateFromSteem = async (account, targetAccount) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios.post('https://api.steemit.com', '{"jsonrpc":"2.0", "method":"condenser_api.get_vesting_delegations", "params":["' + account + '","' + targetAccount + '",10], "id":1}').then(async (res) => {
        const delegations = res.data.result;
        if (!delegations || delegations.length === 0){
          resolve(0)
          return;
        }
        if (delegations[0].delegatee !== targetAccount){
          resolve(0)
        }
        const vests = parseFloat(delegations[0].vesting_shares.split(' ')[0])
        resolve(await vestsToSteem(vests))
      })
      
    } catch (e) {
      console.log(e);
      resolve(-1)
    }
  })
}

async function broadcastOps(ops) {
  return new Promise((resolve, reject) => {
    steem_keychain.requestBroadcast(store.state.steem.steemAccount, ops,
      'Active', function (response) {
        resolve(response)
      })
  })
}