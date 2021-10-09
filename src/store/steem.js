import Cookie from 'vue-cookies'
import {
  vestsToSteem,
  getAccountInfo,
  getSteemBalance,
  getSbdBalance,
  getVestingShares
} from '@/utils/steem/steem'
import {
  encrpty,
  decrypt
} from '@/utils/helper'

export default {
  namespaced: true,
  state: {
    // steem
    steemAccount: Cookie.get('steemAccount'),
    steemActiveKey: Cookie.get('steemActiveKey'),
    steemLoginType: Cookie.get('steemLoginType'),
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
    saveSteemActiveKey: function (state, activeKey) {
      state.steemActiveKey = encrpty(activeKey)
      Cookie.set('steemActiveKey', state.steemActiveKey, '30d')
    },
    saveSteemLoginType: function (state, steemLoginType) {
      state.steemLoginType = steemLoginType
      Cookie.set('steemLoginType', steemLoginType, '30d')
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
    steemActiveKey: state => {
      if (!state.steemActiveKey) return;
      return decrypt(state.steemActiveKey)
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
    }, { steemAccount, activeKey, steemLoginType }) {
      try {
        const account = await getAccountInfo(steemAccount)
        const steem = parseFloat(account.balance)
        const sbd = parseFloat(account.sbd_balance)
        const vests = parseFloat(account.vesting_shares) - parseFloat(account.delegated_vesting_shares)
        commit('saveSteemBalance', steem)
        commit('saveVestsBalance', vests)
        commit('saveSteemAccount', steemAccount)
        commit('saveSteemLoginType', steemLoginType)
        if(activeKey){
          commit('saveSteemActiveKey', activeKey)
        }
        return true
      } catch (err) {
        console.error('initializeSteemAccount Fail:', err.message)
        return false
      }
    },
  }

}
