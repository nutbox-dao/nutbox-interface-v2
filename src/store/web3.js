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
    stakingFactoryId: null,
    communityInfo: null,
    allAssetsOfUser: null,
    allTokens: null,
    blockNum: null,
    nonce: null,
    allCommunities: null,
    myPools: null,
    watcher: {},
    cTokens: {},
    distributions: null,
    readonlyProvider: null,
    allPools: null,
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
    },
    saveCommunityInfo: (state, communityInfo) => {
      state.communityInfo = communityInfo
    },
    saveAllAssetsOfUser: (state, allAssetsOfUser) => {
      state.allAssetsOfUser = allAssetsOfUser
    },
    saveAllTokens: (state, allTokens) => {
      state.allTokens = allTokens
    },
    saveBlockNum : (state, blockNum) => {
      state.blockNum = blockNum
    },
    saveNonce: (state, nonce) => {
      state.nonce = nonce
    },
    saveAllCommunities: (state, communities) => {
      state.allCommunities = communities
    },
    saveMyPools: (state, myPools) => {
      state.myPools = myPools
    },
    saveWatcher: (state, param) => {
      state.watcher[param.name] = param.watcher
    },
    saveCTokens: (state, cTokens) => {
      state.cTokens = cTokens
    },
    saveDistributions: (state, distributions) =>{
      state.distributions = distributions
    },
    saveReadonlyProvider: (state, readonlyProvider) => {
      state.readonlyProvider = readonlyProvider
    },
    saveAllPools: (state, allPools) => {
      state.allPools = allPools
    }
  },
  getters: {
    isMainChain:(state) => {
      return parseInt(state.chainId) === parseInt(BSC_CHAIN_ID)
    },
    communityCard: (state) => {
      const allPools = state.allPools;
      const allCommunities = state.allCommunities
      if (!allPools || !allCommunities) return []
      const cardInfo = allCommunities.map(c => {
        const pools = allPools.filter(pool => pool.communityId === c.id)
        return {
          ...c,
          assetLogos: pools.map(p => p.icon),
          apys: pools.map(p => p.apy)
        }
      })
      console.log(9872435, cardInfo);
      return cardInfo
    }
  }
}
