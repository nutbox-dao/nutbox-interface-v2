
import Cookie from 'vue-cookies'
import {
  LOCALE_KEY
} from '../config'

export default {
  namespaced: true,
    state: {
      // polkadot
      api: null,
      apiState: null,
      subBalance: {},
      subLocked: {},
      subNominators: {},
      subBonded: {},
      bonded: '',
      nominators: [],
      // communityIds
      communitys: [],
      // projectIds
      projects:[],
      crowdstakings:[],
      isConnected: true,
      loadingStaking: true,
      account: Cookie.get('polkadot-account'),
      allAccounts: [],
      balance: 0,
      locked: 0,
      totalStaked: 0,
      unLocking: 0,
      redeemable: 0,
      currentBlockNum: {},
      allValidatorInfosInOurDB: []
    },
    mutations: {
      // pokadot
      saveCommunitys: (state, communitys) => {
        state.communitys = communitys
      },
      saveProjects: (state, projects) => {
        state.projects = projects
      },
      saveCrowdstakings: (state, crowdstakings) => {
        state.crowdstakings = crowdstakings
      },
      saveSubBalance: (state, subBalance) => {
        state.subBalance = subBalance
      },
      saveSubLocked: (state, subLocked) => {
        state.subLocked = subLocked
      },
      saveSubNominators: (state, subNominators) => {
        state.subNominators = subNominators
      },
      saveSubBonded: (state, subBonded) => {
        state.subBonded = subBonded
      },
      saveBonded: (state, bonded) => {
        state.bonded = bonded
      },
      saveNominators: (state, nominators) => {
        state.nominators = nominators
      },
      saveApiState: (state, apiState) => {
        state.apiState = apiState
      },
      saveIsConnected: (state, isConnected) => {
        state.isConnected = isConnected
      },
      saveLoadingStaking: (state, loadingStaking) => {
        state.loadingStaking = loadingStaking
      },
      saveApi: (state, api) => {
        state.api = api
      },
      // saveIsConnected: (state, isConnected) => {
      //   state.isConnected = isConnected
      // },
      saveAccount: (state, account) => {
        state.account = account,
        Cookie.set('polkadot-account', account, '30d')
      },
      saveAllAccounts: (state, allAccounts) => {
        state.allAccounts = allAccounts
      },
      saveBalance: (state, balance) => {
        state.balance = balance
      },
      saveLocked: (state, locked) => {
        state.locked = locked
      },
      saveTotalStaked: (state, totalStaked) => {
        state.totalStaked = totalStaked
      },
      saveUnlocking: (state, unLocking) => {
        state.unLocking = unLocking
      },
      saveRedeemable: (state, redeemable) => {
        state.redeemable = redeemable
      },
      saveCurrentBlockNum: (state, blockNum) => {
        state.currentBlockNum = blockNum
      },
      saveAllValidatorInfosInOurDB: (state, allValidatorInfosInOurDB) => {
        state.allValidatorInfosInOurDB = allValidatorInfosInOurDB
      }
    },
    getters: {
      // polkadot 
      available: (state) => {
        if (state.balance && state.locked){
          return state.balance.sub(state.locked)
        }else{
          return 0
        }
      },
    }
  }