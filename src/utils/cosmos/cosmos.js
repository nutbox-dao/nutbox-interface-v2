import { SigningCosmosClient, coin, conins, coins, MsgBeginRedelegate, MsgUndelegate } from "@cosmjs/launchpad";
import store from '@/store'
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

export const connectWallet = async () => {
    const keplr = await getKeplr()
    await keplr.enable(chainId)
}

export const test = async () => {
    const chainId = "cosmoshub-3";
    await window.keplr.enable(chainId);
    const offlineSigner = window.getOfflineSigner(chainId);

    const accounts = await offlineSigner.getAccounts();

    // Initialize the gaia api with the offline signer that is injected by Keplr extension.
    const cosmJS = new SigningCosmosClient(
        "https://node-cosmoshub-3.keplr.app/rest",
        accounts[0].address,
        offlineSigner
    );

    const result = await cosmJS.sendTokens('cosmos1tg30qk7vwlddcwlr447xlf9dzmgcevslvnfqu4', [{
        denom: "uatom",
        amount: '100000',
    }]);

    console.log(result);

    if (result.code !== undefined &&
        result.code !== 0) {
        alert("Failed to send tx: " + result.log || result.rawLog);
    } else {
        alert("Succeed to send tx");
    }
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