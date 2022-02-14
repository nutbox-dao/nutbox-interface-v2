import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        account: Cookie.get('cosmosAccount'),
        keplrConnected: false,
    },
    mutations: {
        saveAccount: (state, account) => {
            state.account = account;
            Cookie.set('cosmosAccount', account, '30d')
        },
        saveKeplrConnected: (state, keplrConnected) => {
            state.keplrConnected = keplrConnected
        }
    }
}