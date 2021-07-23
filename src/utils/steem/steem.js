import steem from 'steem'
import { STEEM_API_URLS, STEEM_CONF_KEY, STEEM_GAS_ACCOUNT, STEEM_STAKE_FEE } from '../../config.js'
import { sleep } from '../helper'

const steemConf = window.localStorage.getItem(STEEM_CONF_KEY) || STEEM_API_URLS[0]
window.localStorage.setItem(STEEM_CONF_KEY, steemConf)
steem.api.setOptions({ url: steemConf })

function requestBroadcastWithFee (account, address, fee, symbol, operation, needsActive = true) {
  const steemGas = STEEM_GAS_ACCOUNT
  const feeOperation = [
    'transfer',
    {
      from: account,
      to: steemGas,
      amount: fee + ' ' + symbol,
      memo: 'fee: ' + operation[0] + ' ' + address
    }
  ]
  return new Promise(resolve => {
    steem_keychain.requestBroadcast(account, [feeOperation, operation],
      needsActive ? 'Active' : 'Posting', function (response) {
        resolve(response)
      })
  })
}

export async function custom_json (steem, tron) {
  const custom_json = {
    nutbox_op: 'airdrop',
    type: 'wherein',
    tron
  }
  const ops = [
    [
      "custom_json",
      {
        "required_auths":[steem],
        "required_posting_auths": [],
        'id':'nutbox',
        'json':JSON.stringify(custom_json)
      }
    ]
  ]
  return await new Promise(resolve => {
    steem_keychain.requestBroadcast(steem, ops, "Active", function(response){
      resolve(response)
    })
  })
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
  return await new Promise(resolve => {
    steem_keychain.requestBroadcast(from, [transOp],
      'Active', function (response) {
        resolve(response)
      })
  })
}

export async function steemWrap (from, to, amount, memo, currency, address, fee) {
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

export async function steemDelegation (delegator, delegatee, amount, address) {
  const fee = parseFloat(STEEM_STAKE_FEE || 1).toFixed(3)
  return await requestBroadcastWithFee(delegator, address, fee, 'STEEM', [
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
  return await new Promise(resolve => {
    steem_keychain.requestBroadcast(from, [feeOperation, transferVestOp],
      'Active', function (response) {
        resolve(response)
      })
  })
}

export async function getGlobalProperties () {
  return await steem.api.getDynamicGlobalPropertiesAsync()
}

export async function steemToVest (steemPower) {
  const props = await getGlobalProperties()
  const totalSteem = Number(props.total_vesting_fund_steem.split(' ')[0])
  const totalVests = Number(props.total_vesting_shares.split(' ')[0])
  return ((parseFloat(steemPower) * totalVests) / totalSteem).toFixed(6)
}

export async function vestsToSteem (vests) {
  const props = await getGlobalProperties()
  const totalSteem = Number(props.total_vesting_fund_steem.split(' ')[0])
  const totalVests = Number(props.total_vesting_shares.split(' ')[0])
  return ((parseFloat(vests) * totalSteem) / totalVests)
}

export const getAccountInfo = async (account) => {
  const results = await steem.api.getAccountsAsync([account])
  if (results.length === 0) {
    return null
  } else {
    return results[0]
  }
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

export const getDelegateFromSteem = async (account) => {
  try {
    const res = await steem.api.getVestingDelegationsAsync(account, STEEM_MINE_ACCOUNT, 1)
    if (!res || res.length === 0){
      return 0;
    }
    if (res[0].delegatee !== STEEM_MINE_ACCOUNT){
      return 0;
    }
    const vests = parseFloat(res[0].vesting_shares.split(' ')[0])
    return await vestsToSteem(vests)
  } catch (e) {
    return -1
  }
}

export const getKeychain = async () => {
  if (window.steem_keychain) {
    return window.steem_keychain
  }
  await sleep(2)
  return window.steem_keychain
}