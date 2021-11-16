import steem from 'steem'
import { key_utils } from 'steem/lib/auth/ecc'
import { auth } from 'steem'
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

/**
 * Harvest airdrop 
 * @param {*} steem 
 * @param {*} tron 
 * @returns 
 */
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
  return broadcastOps(ops)
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
      console.log('Get steem global data fail:', err)
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
  try {
    const res = await steem.api.getVestingDelegationsAsync(account, targetAccount, 1)
    if (!res || res.length === 0){
      return 0;
    }
    if (res[0].delegatee !== targetAccount){
      return 0;
    }
    const vests = parseFloat(res[0].vesting_shares.split(' ')[0])
    return await vestsToSteem(vests)
  } catch (e) {
    console.log(e);
    return -1
  }
}

/**
 * Verify that the account and password match.
 * @param {String} username steem account name.
 * @param {String} privateKey steem active private key.
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

/**
 * Generate a new hive account
 */
export const generateNewHiveAccount = async () => {
  return new Promise(async (resolve, reject) => {
    let account = null
    try{
      while(!account){
        const num = Math.ceil(Math.random()*3998999) + 10000 
        const acc = 'hive-' + num;
        if(!(await getAccountInfo(acc))){
          account = acc
          break;
        }
      }
      resolve(account)
    }catch(e){
      reject(e)
    }
  })
}

/**
 * generate main password
 * @returns 
 */
export const generatePassword = () => {
  return "P" + key_utils.get_random_key().toWif();
}

const generateAuth = (user, pass, type) => {
  const key = auth.getPrivateKeys(user, pass, [type]);
  const publicKey = auth.wifToPublic(Object.values(key)[0]);
  if (type == "memo") {
    return {
      key: key,
      auth: publicKey
    };
  } else {
    return {
      key: key,
      auth: {
        weight_threshold: 1,
        account_auths: [],
        key_auths: [[publicKey, 1]]
      }
    };
  }
};

/**
 * Genertate keys by password
 * @param {*} username 
 * @param {*} pass 
 * @returns 
 */
export const generateKeys = (username, pass) => {
  const owner = generateAuth(username, pass, "owner");
  const active = generateAuth(username, pass, "active");
  const posting = generateAuth(username, pass, "posting");
  const memo = generateAuth(username, pass, "memo");

  return {
    'key': {
      'owner': owner.key,
      'active': active.key,
      'posting': posting.key,
      'memo': memo.key
    },
    'auth': {
      'owner': owner.auth,
      'active': active.auth,
      'posting': posting.auth,
      'memo': memo.auth
    }
  };
};

/**
 * Create new steem community
 * @param {*} account 
 * @param {*} password 
 * @returns 
 */
export const createNewCommunity = async (creator, account, password) => {
  const account_keys = generateKeys(account, password).auth;
  const ops = 
  [
    [
      "account_create", {
        "fee": "3.000 STEEM",
        "creator": creator,
        "new_account_name": account,
        "owner": account_keys.owner,
        "active": account_keys.active,
        "posting": account_keys.posting,
        "memo_key": account_keys.memo,
        "json_metadata": ""
      }
    ]
  ]
  return await broadcastOps(ops)
}

/**
 * Set community info
 * @param {*} creator 
 * @param {*} account 
 * @param {*} password 
 * @param {*} name 
 * @param {*} description 
 * @returns 
 */
export const setCommunityInfo = async (creator, account, password, name, description) => {
  return new Promise(async (resolve, reject) => {
    const updateProps = [
      "updateProps",
      {
        "community": account,
        props: {
          title: name,
          about: description
        }
      }
    ]
    const setRole = [
      "setRole",
      {
        "community": account,
        account: creator,
        role: 'admin'
      }
    ]
    // const wif = auth.getPrivateKeys(account, password, ['posting'])
    const wif = auth.toWif(account, password, 'posting')
    try{
      const res = await Promise.all(
        [steem.broadcast.customJsonAsync(wif, [], [account], 'community', JSON.stringify(updateProps)),
          steem.broadcast.customJsonAsync(wif, [], [account], 'community', JSON.stringify(setRole))]
      )
      resolve(res)
    }catch(err){
      console.log(err);
      reject(errCode.BLOCK_CHAIN_ERR)
    }
  })
}

/**
 * Subscribe community
 * @returns 
 */
export const subscribeCommunity = async (creator, account) => {
    const subscribeCustom = [
      'subscribe',
      {
        'community': account
      }
    ]
    const ops = [
      [
        "custom_json",
        {
          "required_auths":[],
          "required_posting_auths": [creator],
          'id':'community',
          'json': JSON.stringify(subscribeCustom)
        }
      ]
    ]
    return await broadcastOps(ops);
}

async function broadcastOps(ops) {
  return new Promise((resolve, reject) => {
    console.log(store.state.steem.steemLoginType);
    if (parseInt(store.state.steem.steemLoginType) === 0){// active key
        steem.broadcast.send({
          extensions: [],
          operations: ops
        }, [store.getters['steem/steemActiveKey']], (err, res) => {
          if (err){
            reject();
          }else {
            resolve({success: true})
          }
        })
    }else{ // keychain
      steem_keychain.requestBroadcast(store.state.steem.steemAccount, ops,
        'Active', function (response) {
          resolve(response)
        })
    }
  })
}