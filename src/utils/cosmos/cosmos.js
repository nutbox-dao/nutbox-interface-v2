import store from '@/store'
import  { COSMOS_STAKE_FEE, COSMOS_GAS_ACCOUNT } from '@/config'
import axios from 'axios'
import { SigningStargateClient } from '@cosmjs/stargate'

const chainId = "cosmoshub-4"
const cosmosAuthApiUrl = 'https://rpc-cosmoshub.blockapsis.com'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmos.api.ping.pub/'
// const cosmosAuthApiUrl = 'https://anyplace-cors.herokuapp.com/https://cosmoshub.stakesystems.io'

const getKeplr = async () => {
    return new Promise(async (resolve, reject) => {
        window.onload = async () => {
            if (!window.getOfflineSigner || !window.keplr) {
                resolve(false)
                return;
            }
            const keplr = window.keplr;
            resolve(keplr);
            store.commit(
                'cosmos/saveKeplrConnected', true
            )
        }
    })
}

export const connectWallet = async (callback) => {
    const keplr = await getKeplr()
    await keplr.enable(chainId)
    window.addEventListener('keplr_keystorechange', () => {
        console.log('keplr account changed');
        callback && callback();
    })
}

const getAccountAuth = async () => {
  const account = await getAccount()
  const auth = await axios.get('cosmos/cosmos/auth/v1beta1/accounts/' + account)
  return auth.data.account;
}

export const getAccount = async () => {
    // if (store.state.cosmos.account) return store.state.cosmos.account
    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    store.commit('cosmos/saveAccount', accounts[0].address)
    return accounts[0].address;
}

export const signAndBroadcast = async (msgs, memo) => {
    return new Promise(async (resolve) => {
        const offlineSigner = window.getOfflineSigner(chainId);

        const fee = {
            amount: [
              {
                denom: 'uatom',
                amount: '2000'
              }
            ],
            gas: "260000"
        }
        console.log('start');
        
        const client = await SigningStargateClient.connectWithSigner(cosmosAuthApiUrl, offlineSigner)
        const res = await client.signAndBroadcast(store.state.cosmos.account, msgs, fee, memo)
        if (res.code === 0){
          resolve(res.transactionHash)
        }
        console.log(645, res);
        
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
            amount: [
              {
                denom: 'uatom',
                amount: (COSMOS_STAKE_FEE * 1e6).toString()
              }
            ]
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
            amount: [
              {
                denom: 'uatom',
                amount: COSMOS_STAKE_FEE * 1e6
              }
            ]
        }
    }
    const memo = {
        pid,
        delegator_address: store.state.web3.account
    }

    return signAndBroadcast([msgUndelegate, msgSend], JSON.stringify(memo))
}



// ======================================Transaction demo======================================
// delegate
const delegate_demo = {
    "chain_id": "cosmoshub-4",
    "account_number": "808868",
    "sequence": "0",
    "fee": {
      "gas": "250000",
      "amount": [
        {
          "denom": "uatom",
          "amount": "6250"
        }
      ]
    },
    "msgs": [
      {
        "type": "cosmos-sdk/MsgDelegate",
        "value": {
          "delegator_address": "cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv",
          "validator_address": "cosmosvaloper156gqf9837u7d4c4678yt3rl4ls9c5vuursrrzf",
          "amount": {
            "denom": "uatom",
            "amount": "100000"
          }
        }
      }
    ],
    "memo": ""
  }

  const send_demo = {
    "chain_id": "cosmoshub-4",
    "account_number": "808868",
    "sequence": "1",
    "fee": {
      "gas": "80000",
      "amount": [
        {
          "denom": "uatom",
          "amount": "2000"
        }
      ]
    },
    "msgs": [
      {
        "type": "cosmos-sdk/MsgSend",
        "value": {
          "from_address": "cosmos1khkaslmkk0htu0ug2j7h3geclyxfcfrsmwv9gv",
          "to_address": "cosmos1tg30qk7vwlddcwlr447xlf9dzmgcevslvnfqu4",
          "amount": [
            {
              "denom": "uatom",
              "amount": "100000"
            }
          ]
        }
      }
    ],
    "memo": "test"
  }