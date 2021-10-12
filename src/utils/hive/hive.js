import hive from '@hiveio/hive-js'
import { auth } from '@hiveio/hive-js'
const { Client } = require("@hiveio/dhive");
import { HIVE_API_URLS, HIVE_CONF_KEY, HIVE_GAS_ACCOUNT, HIVE_STAKE_FEE } from '@/config.js'
import { sleep } from '../helper'
import store from '@/store'

const client = new Client(["https://api.hive.blog", "https://api.hivekings.com", "https://anyx.io", "https://api.openhive.network"]);
const hiveConf = window.localStorage.getItem(HIVE_CONF_KEY) || HIVE_API_URLS[0]
window.localStorage.setItem(HIVE_CONF_KEY, hiveConf)
hive.api.setOptions({ url: hiveConf })

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
    try{
      const props = await client.database.getDynamicGlobalProperties();
      resolve(props)
    }catch(e) {
      reject()
    }
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
  const results = await client.database.getAccounts([account])
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
    const res = await client.database.getVestingDelegations(account, targetAccount, 1)
    if (!res || res.length === 0){
      return 0;
    }
    if (res[0].delegatee !== targetAccount){
      return 0;
    }
    const vests = parseFloat(res[0].vesting_shares.split(' ')[0])
    console.log(3245, vests);
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

/**
 * Verify that the account and password match.
 * @param {String} username hive account name.
 * @param {String} privateKey hive active private key.
 * @returns Boolean.
 */
 export const verifyNameAndKey = async function (username, privateKey) {
  const accountInfo = await getAccountInfo(username)
  const publicKey = accountInfo?.active?.key_auths[0][0]
  if (!publicKey) {
    return false
  }

  let res = false
  try {
    res = await auth.wifIsValid(privateKey, publicKey)
  } catch (error) {
    return false
  }
  return res
}

async function broadcastOps(ops) {
  return new Promise((resolve, reject) => {
    if (parseInt(store.state.hive.hiveLoginType) === 0){// active key
        hive.broadcast.send({
          extensions: [],
          operations: ops
        }, [store.getters['hive/hiveActiveKey']], (err, res) => {
          if (err){
            reject();
          }else {
            resolve({success: true})
          }
        })
    }else{ // keychain
      hive_keychain.requestBroadcast(store.state.hive.hiveAccount, ops, 'Active', function (response) {
        resolve(response)
      })
    }
  })
}