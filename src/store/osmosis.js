import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        osmosisAccount: Cookie.get('osmosisAccount'),
        balance: 0
    },
    mutations: {
        saveAccount: (state, osmosisAccount) => {
            state.osmosisAccount = osmosisAccount;
            Cookie.set('osmosisAccount', osmosisAccount, '30d')
        },
        saveBalance: (state, balance) => {
            state.balance = balance
        }
    }
}