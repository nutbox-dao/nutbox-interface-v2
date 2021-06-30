import Cookie from 'vue-cookies'
import { BSC_CHAIN_ID } from '@/config'

export default {
  namespaced: true,
  state: {
    ethers:null,
    account: Cookie.get('bsc-account'),
    allAccounts: [],
    abis: {},
    chainId: -1,
    stakingFactoryId: null
  },
  mutations: {
    saveEthers: (state, ethers) => {
      state.ethers = ethers
    },
    saveAccount: (state, account) => {
      state.account = account,
        Cookie.set('bsc-account', account, '30d')
    },
    saveAllAccounts: (state, allAccounts) => {
      state.allAccounts = allAccounts
    },
    saveAbi: (state, {name, abi}) => {
      state[name] = abi
    },
    saveChainId: (state, chainId) => {
      state.chainId = chainId
    },
    saveStakingFactoryId: (state, stakingFactoryId) => {
      state.stakingFactoryId = stakingFactoryId
    }
  },
  getters: {
    isMainChain:(state) => {
      return parseInt(state.chainId) === parseInt(BSC_CHAIN_ID)
    }
  }
}
