import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import {
  LOCALE_KEY
} from '../config'

import polkadot from './polkadot'
import kusama from './kusama'
import rococo from './rococo'
import web3 from './web3'
import community from '@/store/community'
import steem from './steem'
import hive from './hive'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: Cookie.get(LOCALE_KEY) || 'zh-CN',
    allParachain: null,
    ethPrice: 0,
    prices: {},
    metamaskConnected: false,
    apys: {},
    // exist in child community page
    currentCommunityId: null
  },
  mutations: {
    saveLang: (state, lang) => {
      state.lang = lang
      Cookie.set(LOCALE_KEY, lang, '30d')
    },
    saveAllParachain:(state, allParachain) => {
      state.allParachain = allParachain
    },
    saveEthPrice: (state, ethPrice) => {
      state.ethPrice = ethPrice
    },
    savePrices: (state, prices) => {
      state.prices = prices
    },
    saveMetamaskConnected: (state, metamaskConnected) => {
      state.metamaskConnected = metamaskConnected
    },
    saveApys: (state, apys) => {
      state.apys = apys
    },
    saveCurrentCommunityId: (state, currentCommunityId) => {
      state.currentCommunityId = currentCommunityId
    }
  },
  getters: {
  },
  modules: {
    polkadot,
    kusama,
    rococo,
    web3,
    community,
    steem,
    hive
  }
})
