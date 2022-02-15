import store from '@/store'
import  { COSMOS_STAKE_FEE, COSMOS_GAS_ACCOUNT } from '@/config'
import axios from 'axios'

const chainId = "cosmoshub-4"
const cosmosAuthApiUrl = 'https://api.cosmos.network/'

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
  const auth = await axios.get(cosmosAuthApiUrl + 'cosmos/auth/v1beta1/accounts/' + account)
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
        const auth = await getAccountAuth();
        const fee = {
            amount: [
              {
                denom: 'uatom',
                amount: '2000'
              }
            ],
            gas: "80000"
        }
        const tx = await offlineSigner.signAmino(
          store.state.cosmos.account, 
          {
            chain_id: chainId,
            account_number: auth.account_number,
            sequence: auth.sequence,
            fee,
            memo: memo,
            msgs
          }
        )
        console.log(4326, tx);
        const signature = tx.signature.signature;
        // let res = await axios.post('https://api.cosmos.network/txs', JSON.stringify({
        //   tx: {
        //     msg: msgs,
        //     fee,
        //     memo,
        //     signature: tx.signature
        //   },
        //   mode: 'block'
        // }))
        // console.log(res);
        // return;
        const res = await window.keplr.sendTx(chainId, {
          msg: msgs,
          fee,
          memo,
          signatures: [signature]
        }, 'block') // or sync
        console.log(666 , res);
    })
}

export const delegate = async (validator, amount, pid, address) => {
    const msgDelegate = {
        type: 'cosmos-sdk/MsgDelegate',
        value: {
            delegator_address: store.state.cosmos.account,
            validator_address: validator,
            amount: {
              denom: 'uatom',
              amount
            }
        }
    }
    const msgSend = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: store.state.cosmos.account,
            to_address: COSMOS_GAS_ACCOUNT,
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
        delegator_address: address
    }

    return signAndBroadcast([msgDelegate, msgSend], JSON.stringify(memo))
}

export const unDelegate = async (validator, amount, pid, address) => {
    const msgDelegate = {
        type: 'cosmos-sdk/MsgUndelegate',
        value: {
            delegator_address: store.state.cosmos.account,
            validator_address: validator,
            amount: {
              denom: 'uatom',
              amount
            }
        }
    }
    const msgSend = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: store.state.cosmos.account,
            to_address: COSMOS_GAS_ACCOUNT,
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
        delegator_address: address
    }

    return signAndBroadcast([msgDelegate, msgSend], JSON.stringify(memo))
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
  