import { HIVE_GAS_ACCOUNT, HIVE_STAKE_FEE } from '@/config.js'
import { sleep } from '../helper'
import store from '@/store'
import axios from 'axios'

const RPC_NODE = 'https://api.hive.blog'

async function requestBroadcastWithFee (account, stakingFeast, pid, address, fee, symbol, operation, needsActive = true) {
  const hiveGas = HIVE_GAS_ACCOUNT
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
      to: hiveGas,
      amount: fee + ' ' + symbol,
      memo
    }
  ]
  return await broadcastOps([feeOperation, operation])
}

export async function transferHive (from, to, amount, memo) {
  amount = parseFloat(amount).toFixed(3)
  const transOp = [
    'transfer',
    {
      from,
      to,
      amount: amount + ' HIVE',
      memo
    }
  ]
  return await broadcastOps([transOp])
}

export async function hiveWrap (from, to, amount, memo, currency, address, fee) {
  fee = parseFloat(fee).toFixed(3)
  amount = parseFloat(amount).toFixed(3)
  return await requestBroadcastWithFee(from, address, fee, currency, [
    'transfer',
    {
      from,
      to,
      amount: amount + ' ' + currency,
      memo
    }
  ])
}

export async function hiveDelegation (delegator, delegatee, amount, takingFeast, pid, address) {
  const fee = parseFloat(HIVE_STAKE_FEE || 1).toFixed(3)
  return await requestBroadcastWithFee(delegator, takingFeast, pid, address, fee, 'HIVE', [
    'delegate_vesting_shares',
    {
      delegator,
      delegatee,
      vesting_shares: amount + ' ' + 'VESTS'
    }
  ])
}

export async function hiveTransferVest (from, to, amount, address, fee) {
  fee = parseFloat(fee).toFixed(3)
  const hiveGas = HIVE_GAS_ACCOUNT
  const feeOperation = [
    'transfer',
    {
      from,
      to: hiveGas,
      amount: fee + ' ' + 'HIVE',
      memo: 'fee: ' + 'transfer_to_vesting' + ' ' + address
    }
  ]
  const transferVestOp = [
    'transfer_to_vesting',
    {
      from,
      to,
      amount: amount + ' HIVE'
    }
  ]
  return await broadcastOps([feeOperation, transferVestOp])
}

export async function getGlobalProperties () {
  return new Promise(async (resolve, reject) => {
    axios.post(RPC_NODE, '{"jsonrpc":"2.0", "method":"database_api.get_dynamic_global_properties", "id":1}').then(res => {
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

export async function hiveToVest (hivePower) {
  const props = await getGlobalProperties()
  const totalHive = Number(props.total_vesting_fund_hive.amount) / (10 ** props.total_vesting_fund_hive.precision)
  const totalVests = Number(props.total_vesting_shares.amount) / (10 ** props.total_vesting_shares.precision)
  return ((parseFloat(hivePower) * totalVests) / totalHive).toFixed(6)
}

export async function vestsToHive (vests) {
  const props = await getGlobalProperties()
  const totalHive = Number(props.total_vesting_fund_hive.amount) / (10 ** props.total_vesting_fund_hive.precision)
  const totalVests = Number(props.total_vesting_shares.amount) / (10 ** props.total_vesting_shares.precision)
  return ((parseFloat(vests) * totalHive) / totalVests)
}

export const getAccountInfo = async (account) => {
  return new Promise((resolve, reject) => {
    axios.post(RPC_NODE, '{"jsonrpc":"2.0", "method":"condenser_api.get_accounts", "params":[["' + account +'"]], "id":1}').then(res => {
      if (res.data.result) {
        resolve(res.data.result[0])
      }
      else {
        reject()
      }
    }).catch(err => {
      console.log('Get hive account data fail:', err)
      reject(err)
    })

  })
}

export const getHiveBalance = async (username) => {
  const accountInfo = await getAccountInfo(username)
  return parseFloat(accountInfo.balance)
}

export const getVestingShares = async (username) => {
  const account = await getAccountInfo(username)
  const staked = parseFloat(account.vesting_shares)
  const delegated = parseFloat(account.delegated_vesting_shares)
  return staked - delegated
}

export const getDelegateFromHive = async (account, targetAccount) => {
  return new Promise(async (resolve, reject) => {
    try {
      axios.post(RPC_NODE, '{"jsonrpc":"2.0", "method":"condenser_api.get_vesting_delegations", "params":["' + account + '","' + targetAccount + '",10], "id":1}').then(async (res) => {
        const delegations = res.data.result;
        if (!delegations || delegations.length === 0){
          resolve(0)
          return;
        }
        if (delegations[0].delegatee !== targetAccount){
          resolve(0)
        }
        const vests = parseFloat(delegations[0].vesting_shares.split(' ')[0])
        resolve(await vestsToHive(vests))
      })
      
    } catch (e) {
      console.log(e);
      resolve(-1)
    }
  })
}

export const getKeychain = async () => {
  if (window.hive_keychain) {
    return window.hive_keychain
  }
  await sleep(2)
  return window.hive_keychain
}

async function broadcastOps(ops) {
  return new Promise(async (resolve, reject) => {
      hive_keychain.requestBroadcast(store.state.hive.hiveAccount, ops, 'Active', function (response) {
        resolve(response)
      })
  })
}