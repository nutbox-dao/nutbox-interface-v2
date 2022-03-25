import store from '@/store'
import {
  OSMOSIS_STAKE_FEE,
  OSMOSIS_GAS_ACCOUNT
} from '@/config'
import axios from 'axios'
import {
  SigningStargateClient
} from '@cosmjs/stargate'
import { errCode } from '@/config'

const chainId = "osmosis-1"
const ApiUrl = 'https://anyplace-cors.herokuapp.com/https://lcd-osmosis.keplr.app/bank/balances/'
const RpcUrl = 'https://osmosis.validator.network/'
// const cosmosAuthApiUrl = 'https://rpc.cosmos.network'
// const cosmosAuthApiUrl = 'https://api.cosmos.network'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmos.api.ping.pub/'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmoshub.stakesystems.io'
// 'https://api.cosmos.network/cosmos/bank/v1beta1/balances/cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv/uatom'

const getKeplr = async () => {
  return new Promise(async (resolve, reject) => {
    if (!window.getOfflineSigner || !window.keplr) {
      resolve(false)
      return;
    }
    const keplr = window.keplr;
    resolve(keplr);
    store.commit(
      'cosmos/saveKeplrConnected', true
    )
  })
}

export const connectWallet = async (callback) => {
  const keplr = await getKeplr()
  // await keplr.enable(chainId)
  window.addEventListener('keplr_keystorechange', async () => {
    //console.log('keplr account changed');
    //callback && callback();
    await getAccount();
  })
}

export const getAccountBalance = async () => {
  // const balance = 1;
  // store.commit('osmosis/saveBalance', balance)
  // return balance
  try {
    const account = await getAccount()
    const auth = await axios.get(ApiUrl + account)
    const balance = auth.data.result[0].amount / 1e6;
    store.commit('osmosis/saveBalance', balance)
    return balance
  }catch(e) {
    console.log('Get osmo balance fail:', e);
    
  }
}

export const getAccount = async () => {
  // if (store.state.cosmos.cosmosAccount) return store.state.cosmos.cosmosAccount
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  store.commit('osmosis/saveAccount', accounts[0].address)
  return accounts[0].address;
}

export const signAndBroadcast = async (msgs, memo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const keplr = await getKeplr()
      await keplr.enable(chainId)
      const offlineSigner = window.getOfflineSigner(chainId);

      const fee = {
        amount: [{
          denom: 'uosmo',
          amount: '6000'
        }],
        gas: "260000"
      }
      console.log('start');

      const client = await SigningStargateClient.connectWithSigner(RpcUrl, offlineSigner)
      const res = await client.signAndBroadcast(store.state.osmosis.osmosisAccount, msgs, fee, memo)
      if (res.code === 0) {
        console.log('Transaction hash:', res.transactionHash);
        resolve(res.transactionHash)
      }else {
        reject(errCode.TRANSACTION_FAIL)
      }
    } catch (e) {
      if (e === 'Error: Request rejected') {
        console.log('23525');
      }
      console.log('esg', e); // Error: Request rejected
      reject(errCode.USER_CANCEL_SIGNING)
    }
  })
}

export const delegate = async (validator, amount, pid) => {
  const msgDelegate = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: {
      delegatorAddress: store.state.osmosis.osmosisAccount,
      validatorAddress: validator,
      amount: {
        denom: 'uosmo',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.osmosis.osmosisAccount,
      toAddress: OSMOSIS_GAS_ACCOUNT,
      amount: [{
        denom: 'uosmo',
        amount: (OSMOSIS_STAKE_FEE * 1e6).toString()
      }]
    }
  }
  const memo = {
    pid,
    delegator_address: store.state.web3.account
  }

  return await signAndBroadcast([msgDelegate, msgSend], JSON.stringify(memo))
}

export const unDelegate = async (validator, amount, pid, address) => {
  const msgUndelegate = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: {
      delegatorAddress: store.state.osmosis.osmosisAccount,
      validatorAddress: validator,
      amount: {
        denom: 'uosmo',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.osmosis.osmosisAccount,
      toAddress: OSMOSIS_GAS_ACCOUNT,
      amount: [{
        denom: 'uosmo',
        amount: (OSMOSIS_STAKE_FEE * 1e6).toString()
      }]
    }
  }
  const memo = {
    pid,
    delegator_address: store.state.web3.account
  }

  return await signAndBroadcast([msgUndelegate, msgSend], JSON.stringify(memo))
}



// ======================================Transaction demo======================================

// tx: CpQBCpEBChwvY29zbW9zLmJhbmsudjFiZXRhMS5Nc2dTZW5kEnEKLWNvc21vczFsMHpuc3ZkZGxsdzlrbmhhM3l4MnN2bmx4bnk2NzZkOG5zN3V5cxItY29zbW9zMWtxd2NxNzZ4bXBrcWc1ajh3bWg1dDhmbXcyN2w2cGFjN3V0bTQ2GhEKBXVhdG9tEggxNzkyMTcxOBJpClIKRgofL2Nvc21vcy5jcnlwdG8uc2VjcDI1NmsxLlB1YktleRIjCiECX9MXzHSLirRcEAjuy7h7HNnpPjkn/WN1VUOxpuZQl1ESBAoCCAEYnqgJEhMKDQoFdWF0b20SBDMwMDAQ4KcSGkDOuF1Zpczvkw2DKIhO25A6LZeQNRV2c355fXcpSMbjsgnixAQi9GSc+SvEQCyF+NI5O9HhLwgUPWTr/LZ25TSk
// delegate
const delegate_demo = {
  "chain_id": "cosmoshub-4",
  "account_number": "808868",
  "sequence": "0",
  "fee": {
    "gas": "250000",
    "amount": [{
      "denom": "uatom",
      "amount": "6250"
    }]
  },
  "msgs": [{
    "type": "cosmos-sdk/MsgDelegate",
    "value": {
      "delegator_address": "cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv",
      "validator_address": "cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf",
      "amount": {
        "denom": "uatom",
        "amount": "100000"
      }
    }
  }],
  "memo": ""
}

const send_demo = {
  "chain_id": "cosmoshub-4",
  "account_number": "808868",
  "sequence": "1",
  "fee": {
    "gas": "80000",
    "amount": [{
      "denom": "uatom",
      "amount": "2000"
    }]
  },
  "msgs": [{
    "type": "cosmos-sdk/MsgSend",
    "value": {
      "from_address": "cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv",
      "to_address": "cosmos1tg30qk7vwlddcwlr447xlf9dzmgcevslvnfqu4",
      "amount": [{
        "denom": "uatom",
        "amount": "100000"
      }]
    }
  }],
  "memo": "test"
}
