import hive from '@hiveio/hive-js'
import { HIVE_API_URLS, HIVE_CONF_KEY, HIVE_GAS_ACCOUNT, HIVE_STAKE_FEE } from '@/config.js'
import { sleep } from '../helper'

const hiveConf = window.localStorage.getItem(HIVE_CONF_KEY) || HIVE_API_URLS[0]
window.localStorage.setItem(HIVE_CONF_KEY, hiveConf)
hive.api.setOptions({ url: hiveConf })

function requestBroadcastWithFee (account, address, fee, symbol, operation, needsActive = true) {
  const hiveGas = HIVE_GAS_ACCOUNT
  const feeOperation = [
    'transfer',
    {
      from: account,
      to: hiveGas,
      amount: fee + ' ' + symbol,
      memo: 'fee: ' + operation[0] + ' ' + address
    }
  ]
  return new Promise(resolve => {
    hive_keychain.requestBroadcast(account, [feeOperation, operation],
      needsActive ? 'Active' : 'Posting', function (response) {
        resolve(response)
      })
  })
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
  return await new Promise(resolve => {
    hive_keychain.requestBroadcast(from, [transOp],
      'Active', function (response) {
        resolve(response)
      })
  })
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

export async function hiveDelegation (delegator, delegatee, amount, address) {
  const fee = parseFloat(HIVE_STAKE_FEE || 1).toFixed(3)
  return await requestBroadcastWithFee(delegator, address, fee, 'HIVE', [
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
  return await new Promise(resolve => {
    hive_keychain.requestBroadcast(from, [feeOperation, transferVestOp],
      'Active', function (response) {
        resolve(response)
      })
  })
}

export async function getGlobalProperties () {
  return new Promise(async (resolve, reject) => {
    hive.api.getDynamicGlobalProperties((err, res) => {
      if(err) {
        console.log('Hive getGlobalProperties err', err);
        reject(err)
      }else
        resolve(res)
    })
  })
}

export async function hiveToVest (hivePower) {
  const props = await getGlobalProperties()
  const totalHive = Number(props.total_vesting_fund_hive.split(' ')[0])
  const totalVests = Number(props.total_vesting_shares.split(' ')[0])
  return ((parseFloat(hivePower) * totalVests) / totalHive).toFixed(6)
}

export async function vestsToHive (vests) {
  const props = await getGlobalProperties()
  const totalHive = Number(props.total_vesting_fund_hive.split(' ')[0])
  const totalVests = Number(props.total_vesting_shares.split(' ')[0])
  return ((parseFloat(vests) * totalHive) / totalVests)
}

export const getAccountInfo = async (account) => {
  const results = await hive.api.getAccountsAsync([account])
  if (results.length === 0) {
    return null
  } else {
    return results[0]
  }
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
  try {
    const res = await hive.api.getVestingDelegationsAsync(account, targetAccount, 1)
    if (!res || res.length === 0){
      return 0;
    }
    if (res[0].delegatee !== targetAccount){
      return 0;
    }
    const vests = parseFloat(res[0].vesting_shares.split(' ')[0])
    return await vestsToHive(vests)
  } catch (e) {
    return -1
  }
}

export const getKeychain = async () => {
  if (window.hive_keychain) {
    return window.hive_keychain
  }
  await sleep(2)
  return window.hive_keychain
}