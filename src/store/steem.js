import Cookie from 'vue-cookies'
import { SP_DELEGATE_DECIMAL } from '@/constant'

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
    },

    // pool info 
    saveDepositedVestsInt: (state, depositedVestsInt) => {
      state.depositedVestsInt =depositedVestsInt
    }
  },
  getters: {
    // steem
    spBalance: state => {
      return state.vestsBalance * state.vestsToSteem || 0
    },
    depositedSP: state => (account) => {
      return parseFloat(state.depositedVestsInt[account] * 1e-6 * state.vestsToSteem).toFixed(6)
    }
  }
   
}
