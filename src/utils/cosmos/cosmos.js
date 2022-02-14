import { SigningCosmosClient, coin, coins, MsgBeginRedelegate, MsgUndelegate, AminoMsg, 
StdSignDoc } from "@cosmjs/launchpad";
import store from '@/store'
import { makeSignDoc, serializeSignDoc } from '@cosmjs/amino'
import  { COSMOS_STAKE_FEE, COSMOS_GAS_ACCOUNT } from '@/config'

const chainId = "cosmoshub-4"

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

export const test = async () => {
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);
    const key = await window.keplr.getKey(chainId)
    console.log(67623, key);
    const doc = makeSignDoc([{
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: store.state.cosmos.account,
            to_address: COSMOS_GAS_ACCOUNT,
            amount: coins(COSMOS_STAKE_FEE * 1e6, 'uatom')
        }
    }], {
        amount: coins(6250, 'uatom'),
        gas: "250000"
    }, chainId, 'test', 808868, 3)
    console.log(2345, doc);
    const stdDoc = serializeSignDoc(doc)
    console.log(1111, stdDoc);
    const res =  await offlineSigner.signAmino(store.state.cosmos.account, {
        chain_id: chainId,
        account_number: '808868',
        sequence: 4,
        fee: {
            amount: coins(6250, 'uatom'),
            gas: "250000"
        },
        memo: 'test',
        msgs: [
            {
                type: 'cosmos-sdk/MsgSend',
                value: {
                    from_address: store.state.cosmos.account,
                    to_address: COSMOS_GAS_ACCOUNT,
                    amount: coins(COSMOS_STAKE_FEE * 1e6, 'uatom')
                }
            }
        ]
    } 
      ).catch(e => {
          console.log(722, e);
      })
    console.log(6686, res);
}

export const getAccount = async () => {
    // if (store.state.cosmos.account) return store.state.cosmos.account
    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();
    store.commit('cosmos/saveAccount', accounts[0].address)
    return accounts[0].address;
}

export const getCosmJS = () => {
    const cosm = new SigningCosmosClient(
        "https://node-cosmoshub-3.keplr.app/rest",
        store.state.cosmos.account, 
        window.getOfflineSigner(chainId));
    return cosm
}

export const signAndBroadcast = async (msgs, memo) => {
    return new Promise((resolve) => {
        const cosm = getCosmJS()
        const fee = {
            amount: coins(6250, 'uatom'),
            gas: "250000"
        }
        cosm.signAndBroadcast(msgs, fee, memo).then(res => {
            resolve(res)
        }).catch(e => {
            console.log(677, e);
        })
    })
}

export const delegate = async (validator, amount, pid, address) => {
    const msgDelegate = {
        type: 'consmos-sdk/MsgDelegate',
        value: {
            delegator_address: store.state.cosmos.account,
            validator_address: validator,
            amount: coin(amount, 'uatom')
        }
    }
    const msgSend = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: store.state.cosmos.account,
            to_address: COSMOS_GAS_ACCOUNT,
            amount: coins(COSMOS_STAKE_FEE * 1e6, 'uatom')
        }
    }
    const memo = {
        pid,
        delegator_address: address
    }

    return signAndBroadcast([msgSend], JSON.stringify(memo))
}

export const unDelegate = async (validator, amount, pid, address) => {
    const msgDelegate = {
        type: 'consmos-sdk/MsgUndelegate',
        value: {
            delegator_address: store.state.cosmos.account,
            validator_address: validator,
            amount: coin(
                amount, 'uatom'
            )
        }
    }
    const msgSend = {
        type: 'cosmos-sdk/MsgSend',
        value: {
            from_address: store.state.cosmos.account,
            to_address: COSMOS_GAS_ACCOUNT,
            amount: coins(COSMOS_STAKE_FEE * 1e6, 'uatom')
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
  