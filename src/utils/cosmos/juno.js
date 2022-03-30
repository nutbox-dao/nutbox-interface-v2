import store from '@/store'
import {
  JUNO_STAKE_FEE,
  JUNO_GAS_ACCOUNT
} from '@/config'
import axios from 'axios'
import {
  SigningStargateClient
} from '@cosmjs/stargate'
import { errCode } from '@/config'

const chainId = "juno-1"
// const ApiUrl = 'https://anyplace-cors.herokuapp.com/https://lcd-juno.keplr.app/bank/balances/'
const ApiUrl = 'https://rest.cosmos.directory/juno/bank/balances/'
const RpcUrl = 'https://rpc-juno.itastakers.com/'
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
  // store.commit('juno/saveBalance', balance)
  // return balance
  try {
    const account = await getAccount()
    const auth = await axios.get(ApiUrl + account)
    for (let r of auth.data.result) {
      if (r.denom === 'ujuno') {
        const balance = r.amount / 1e6;
        store.commit('juno/saveBalance', balance)
        return balance
      }
    }
    return 0;
  }catch(e) {
    console.log('Get osmo balance fail:', e);
    
  }
}

export const getAccount = async () => {
  // if (store.state.cosmos.cosmosAccount) return store.state.cosmos.cosmosAccount
  const offlineSigner = window.getOfflineSigner(chainId);
  const accounts = await offlineSigner.getAccounts();
  store.commit('juno/saveAccount', accounts[0].address)
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
          denom: 'ujuno',
          amount: '650'
        }],
        gas: "300000"
      }
      console.log('start');

      const client = await SigningStargateClient.connectWithSigner(RpcUrl, offlineSigner)
      const res = await client.signAndBroadcast(store.state.juno.junoAccount, msgs, fee, memo)
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
      delegatorAddress: store.state.juno.junoAccount,
      validatorAddress: validator,
      amount: {
        denom: 'ujuno',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.juno.junoAccount,
      toAddress: JUNO_GAS_ACCOUNT,
      amount: [{
        denom: 'ujuno',
        amount: (JUNO_STAKE_FEE * 1e6).toString()
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
      delegatorAddress: store.state.juno.junoAccount,
      validatorAddress: validator,
      amount: {
        denom: 'ujuno',
        amount: amount.toString()
      }
    }
  }
  const msgSend = {
    typeUrl: '/cosmos.bank.v1beta1.MsgSend',
    value: {
      fromAddress: store.state.juno.junoAccount,
      toAddress: JUNO_GAS_ACCOUNT,
      amount: [{
        denom: 'ujuno',
        amount: (JUNO_STAKE_FEE * 1e6).toString()
      }]
    }
  }
  const memo = {
    pid,
    delegator_address: store.state.web3.account
  }

  return await signAndBroadcast([msgUndelegate, msgSend], JSON.stringify(memo))
}