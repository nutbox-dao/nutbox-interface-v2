import Cookie from 'vue-cookies'
import {
  vestsToHive,
  getAccountInfo,
  getHiveBalance,
  getVestingShares
} from '@/utils/hive/hive'
import {
  encrpty,
  decrypt
} from '@/utils/helper'

export default {
  namespaced: true,
  state: {
    // hive
    hiveAccount: Cookie.get('hiveAccount'),
    hiveActiveKey: Cookie.get('hiveActiveKey'),
    hiveLoginType: Cookie.get('hiveLoginType'),
    
    hiveBalance: 0,
    vestsBalance: 0,
    vestsToHive: 0,

    // pool info
    /**
     * use hive account for key. This shows how many vestint deposit to the pool
     * this is the amount store in contract
     */
    depositedVestsInt: {},

  },
  mutations: {
    // hive
    saveHiveAccount: function (state, hiveAccount) {
      state.hiveAccount = hiveAccount
      Cookie.set('hiveAccount', hiveAccount, '30d')
    },
    saveHiveActiveKey: function (state, activeKey) {
      state.hiveActiveKey = encrpty(activeKey)
      Cookie.set('hiveActiveKey', state.hiveActiveKey, '30d')
    },
    saveHiveLoginType: function (state, hiveLoginType) {
      state.hiveLoginType = hiveLoginType
      Cookie.set('hiveLoginType', hiveLoginType, '30d')
    },
    saveHiveBalance: function (state, hiveBalance) {
      state.hiveBalance = hiveBalance
    },
    saveVestsBalance: function (state, vestsBalance) {
      state.vestsBalance = vestsBalance
    },
    saveVestsToHive: function (state, vestsToHive) {
      state.vestsToHive = vestsToHive
    },
    clearHiveAccount(state) {
      state.hiveAccount = null
      Cookie.remove('hiveAccount')
    },

    // pool info 
    saveDepositedVestsInt: (state, depositedVestsInt) => {
      state.depositedVestsInt = depositedVestsInt
    }
  },
  getters: {
    // hive
    hpBalance: state => {
      return state.vestsBalance * state.vestsToHive || 0
    },
    depositedHP: state => (account) => {
      return parseFloat(state.depositedVestsInt[account] * 1e-6 * state.vestsToHive).toFixed(6)
    },
    hiveActiveKey: state => {
      if (!state.hiveActiveKey) return;
      return decrypt(state.hiveActiveKey)
    },
  },
  actions: {
    setVestsToHive({
      commit
    }) {
      vestsToHive(1).then((res) => {
        console.log('hive vests', res);
        commit('saveVestsToHive', res)
      })
    },

    getHive({
      commit,
      state
    }) {
      getHiveBalance(state.hiveAccount).then((hive) => {
        commit('saveHiveBalance', hive)
      })
    },

    getVests({
      commit,
      state
    }) {
    getVestingShares(state.hiveAccount).then((vests) => {
        commit('saveVestsBalance', vests)
      })
    },
    async initializeHiveAccount({
      commit
    }, { hiveAccount, activeKey, hiveLoginType }) {
      try {
        const account = await getAccountInfo(hiveAccount)
        const hive = parseFloat(account.balance)
        const vests = parseFloat(account.vesting_shares) - parseFloat(account.delegated_vesting_shares)
        commit('saveHiveBalance', hive)
        commit('saveVestsBalance', vests)
        commit('saveHiveAccount', hiveAccount)
        commit('saveHiveLoginType', hiveLoginType)
        if(activeKey){
          commit('saveHiveActiveKey', activeKey)
        }
        return true
      } catch (err) {
        // console.error('initializeHiveAccount Fail:', err.message)
        return false
      }
    },
  }

}
