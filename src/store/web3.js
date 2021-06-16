import Cookie from 'vue-cookies'


export default {
  namespaced: true,
  state: {
    account: Cookie.get('bsc-account'),
    allAccounts: []
  },
  mutations: {
    saveAccount: (state, account) => {
      state.account = account,
        Cookie.set('bsc-account', account, '30d')
    },
    saveAllAccounts: (state, allAccounts) => {
      state.allAccounts = allAccounts
    },
  },
  getters: {

  }
}
