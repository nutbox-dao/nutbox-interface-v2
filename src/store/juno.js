import Cookie from 'vue-cookies'

export default {
    namespaced: true,
    state: {
        junoAccount: Cookie.get('junoAccount'),
        balance: 0
    },
    mutations: {
        saveAccount: (state, junoAccount) => {
            state.junoAccount = junoAccount;
            Cookie.set('junoAccount', junoAccount, '30d')
        },
        saveBalance: (state, balance) => {
            state.balance = balance
        }
    }
}