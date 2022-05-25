import Vue from 'vue'
import Vuex from 'vuex'
import Cookie from 'vue-cookies'
import {
  LOCALE_KEY
} from '../config'

import web3 from './web3'
import community from '@/store/community'
import currentCommunity from './currentCommunity'
import user from './user'
import pool from './pool'
import kusama from './kusama'
import polkadot from './polkadot'
import dappstaking from './dappstaking'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    lang: Cookie.get(LOCALE_KEY) || 'zh-CN',
    allParachain: null,
    prices: {},
    metamaskConnected: false,
    apys: {},
    tvl: 0
  },
  mutations: {
    saveLang: (state, lang) => {
      state.lang = lang
      Cookie.set(LOCALE_KEY, lang, '30d')
    },
    saveAllParachain:(state, allParachain) => {
      state.allParachain = allParachain
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
    saveTvl: (state, tvl) => {
      state.tvl = tvl
    }
  },
  getters: {
  },
  modules: {
    web3,
    community,
    currentCommunity,
    user,
    pool,
    kusama,
    polkadot,
    dappstaking
  }
})
