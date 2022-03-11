import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        cosmosAccount: Cookie.get('cosmosAccount'),
        keplrConnected: false,
        balance: 0
    },
    mutations: {
        saveAccount: (state, cosmosAccount) => {
            state.cosmosAccount = cosmosAccount;
            Cookie.set('cosmosAccount', cosmosAccount, '30d')
        },
        saveKeplrConnected: (state, keplrConnected) => {
            state.keplrConnected = keplrConnected
        },
        saveBalance: (state, balance) => {
            state.balance = balance
        }
    }
}