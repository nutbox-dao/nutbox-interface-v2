import store from '@/store'
import {
  COSMOS_STAKE_FEE,
  COSMOS_GAS_ACCOUNT,
  COSMOS_API_URLS
} from '@/config'
import axios from 'axios'
import {
  SigningStargateClient
} from '@cosmjs/stargate'
import {
  AccAddress,
  ValAddress
} from '@chainapsis/cosmosjs/common/address'
import {
  ethers
} from 'ethers'
import { errCode } from '@/config'

const chainId = "cosmoshub-4"
const cosmosAuthApiUrl = 'https://rpc-cosmoshub.blockapsis.com'
// const cosmosAuthApiUrl = 'https://api.cosmos.network'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmos.api.ping.pub/'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmoshub.stakesystems.io'
// 'https://api.cosmos.network/cosmos/bank/v1beta1/balances/cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv/uatom'



export const addressAccToAccBech32 = (address) => {
  if (address == ethers.constants.AddressZero) return ''
  let account = new Uint8Array(Buffer.from(address.substring(2), 'hex'));
  account = new AccAddress(account, 'cosmos');
  account = account.toBech32()
  return account;
}

export const addressAccToValBech32 = (address) => {
  if(address == ethers.constants.AddressZero) return ''
  let account = new Uint8Array(Buffer.from(address.substring(2), 'hex'));
  account = new ValAddress(account, 'cosmosvaloper');
  account = account.toBech32()
  return account;
}

export const accBech32ToAddress = (address) => {
  let account = new AccAddress.fromBech32(address, 'cosmos');
  return ethers.utils.hexlify(account.toBytes());
}

export const valBech32ToAddress = (address) => {
  let account = new ValAddress.fromBech32(address, 'cosmosvaloper');
  return ethers.utils.hexlify(account.toBytes());
}


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
  // const keplr = await getKeplr()
  // await keplr.enable(chainId)
  window.addEventListener('keplr_keystorechange', () => {
    console.log('keplr account changed');
    callback && callback();
  })
}

const getAccountAuth = async () => {
  const account = await getAccount()
  const auth = await axios.get(COSMOS_API_URLS[0] + '/cosmos/cosmos/auth/v1beta1/accounts/' + account)
  return auth.data.account;
}

export const getAccountBalance = async () => {
  const account = await getAccount()
  const auth = await axios.get(COSMOS_API_URLS[0] + '/cosmos/bank/v1beta1/balances/' + account + '/uatom')
  const balance = auth.data.balance.amount / 1e6;
  store.commit('cosmos/saveBalance', balance)
  return balance
}

export const getDelegateFromCosmos = async (account, targetAccount) => {

  const auth = await axios.get(COSMOS_API_URLS[1] + '/cosmos/staking/v1beta1/validators/' + targetAccount + '/delegations/' + account)

  return auth.data.balance.amount / 1e6;
}
// osmo  1khkaslmkk0htu0ug2j7h3geclyxfcfrsn4l477
// cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv

export const getAccount = async () => {
  // if (store.state.cosmos.account) return store.state.cosmos.account
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  // store.commit('cosmos/saveAccount', accounts[0].address)
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
          denom: 'uatom',
          amount: '2000'
        }],
        gas: "260000"
      }
      console.log('start');

      const client = await SigningStargateClient.connectWithSigner(cosmosAuthApiUrl, offlineSigner)
      const res = await client.signAndBroadcast(store.state.cosmos.account, msgs, fee, memo)
      if (res.code === 0) {
        resolve(res.transactionHash)
      }
      console.log(645, res);
    } catch (e) {
      if (e === 'Error: Request rejected') {
        console.log('23525');
      }

      console.log('esg', e); // Error: Request rejected
      reject(errCode.USER_CANCEL_SIGNING)
    }

    // const tx = await offlineSigner.signAmino(
    //   store.state.cosmos.account, 
    //   {
    //     chain_id: chainId,
    //     account_number: auth.account_number,
    //     sequence: auth.sequence,
    //     fee, 
    //     memo: memo,
    //     msgs
    //   }
    // )
    // console.log(4326, tx);
    // const signature = tx.signature.signature;
    // const { signed, signature } = tx
    // const stdTx = {
    //   type: 'auth/StdTx',
    //   value: {
    //     msg: signed.msgs,
    //     fee: signed.fee,
    //     memo,
    //     signatures: Array.isArray(signature) ? signature : [signature]
    //   }
    // }
    // const txs = JSON.parse(JSON.stringify(stdTx))

    // const res  = await axios.post('https://api.cosmos.network/cosmos/tx/v1beta1/txs', {
    //   tx_bytes: marshalStdTx(txs),
    //   mode: 'BROADCAST_MODE_BLOCK'
    // })
  })
}

export const delegate = async (validator, amount, pid) => {
  const msgDelegate = {
    typeUrl: '/cosmos.staking.v1beta1.MsgDelegate',
    value: {
      delegatorAddress: store.state.cosmos.account,
      validatorAddress: validator,
      amount: {
        denom: 'uatom',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.cosmos.account,
      toAddress: COSMOS_GAS_ACCOUNT,
      amount: [{
        denom: 'uatom',
        amount: (COSMOS_STAKE_FEE * 1e6).toString()
      }]
    }
  }
  const memo = {
    pid,
    delegator_address: store.state.web3.account
  }

  return signAndBroadcast([msgDelegate, msgSend], JSON.stringify(memo))
}

export const unDelegate = async (validator, amount, pid, address) => {
  const msgUndelegate = {
    typeUrl: '/cosmos.staking.v1beta1.MsgUndelegate',
    value: {
      delegatorAddress: store.state.cosmos.account,
      validatorAddress: validator,
      amount: {
        denom: 'uatom',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.cosmos.account,
      toAddress: COSMOS_GAS_ACCOUNT,
      amount: [{
        denom: 'uatom',
        amount: COSMOS_STAKE_FEE * 1e6
      }]
    }
  }
  const memo = {
    pid,
    delegator_address: store.state.web3.account
  }

  return signAndBroadcast([msgUndelegate, msgSend], JSON.stringify(memo))
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
