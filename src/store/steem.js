import Cookie from 'vue-cookies'
import {
  vestsToSteem,
  getAccountInfo,
  getSteemBalance,
  getSbdBalance,
  getVestingShares
} from '@/utils/steem/steem'

export default {
  namespaced: true,
  state: {
    // steem
    steemAccount: Cookie.get('steemAccount'),
    steemBalance: 0,
    vestsBalance: 0,
    vestsToSteem: 0,

    // pool info
    /**
     * use steem account for key. This shows how many vestint deposit to the pool
     * this is the amount store in contract
     */
    depositedVestsInt: {},

  },
  mutations: {
    // steem
    saveSteemAccount: function (state, steemAccount) {
      state.steemAccount = steemAccount
      Cookie.set('steemAccount', steemAccount, '30d')
    },
    saveSteemBalance: function (state, steemBalance) {
      state.steemBalance = steemBalance
    },
    saveVestsBalance: function (state, vestsBalance) {
      state.vestsBalance = vestsBalance
    },
    saveVestsToSteem: function (state, vestsToSteem) {
      state.vestsToSteem = vestsToSteem
    },
    clearSteemAccount(state) {
      state.steemAccount = null
      Cookie.remove('steemAccount')
      state.steemBalance = 0
      state.vestsBalance = 0
    },

    // pool info 
    saveDepositedVestsInt: (state, depositedVestsInt) => {
      state.depositedVestsInt = depositedVestsInt
    }
  },
  getters: {
    // steem
    spBalance: state => {
      return state.vestsBalance * state.vestsToSteem || 0
    },
    depositedSP: state => (account) => {
      return parseFloat(state.depositedVestsInt[account] * 1e-6 * state.vestsToSteem).toFixed(6)
    },
  },
  actions: {
    setVestsToSteem({
      commit
    }) {
      vestsToSteem(1).then((res) => {
        console.log('steem vests', res);
        commit('saveVestsToSteem', res)
      }).catch(console.error)
    },

    getSteem({
      commit,
      state
    }) {
      getSteemBalance(state.steemAccount).then((steem) => {
        commit('saveSteemBalance', steem)
      })
    },

    getVests({
      commit,
      state
    }) {
    getVestingShares(state.steemAccount).then((vests) => {
        commit('saveVestsBalance', vests)
      })
    },
    async initializeSteemAccount({
      commit
    }, steemAccount) {
      try {
        const account = await getAccountInfo(steemAccount)
        const steem = parseFloat(account.balance)
        const sbd = parseFloat(account.sbd_balance)
        const vests = parseFloat(account.vesting_shares) - parseFloat(account.delegated_vesting_shares)
        commit('saveSteemBalance', steem)
        commit('saveVestsBalance', vests)
        commit('saveSteemAccount', steemAccount)
        return true
      } catch (err) {
        console.error('initializeSteemAccount Fail:', err.message)
        return false
      }
    },
  }

}
