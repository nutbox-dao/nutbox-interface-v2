import Cookie from "vue-cookies";
import { BSC_CHAIN_ID } from "@/config";
import { ASSET_LOGO_URL } from "@/constant";
import { ethers } from 'ethers'

export default {
  namespaced: true,
  state: {
    ethers: null,
    walnutInfo: {},
    account: Cookie.get("bsc-account"),
    allAccounts: [],
    abis: {},
    chainId: -1,
    stakingFactoryId: null,
    allAssetsOfUser: null,
    allTokens: null,
    allErc1155s: null,
    erc1155ByKey: {},
    tokenByKey: {},
    tokenDecimals: {},
    tokenIcons: {},
    blockNum: null,
    nonce: null,
    allCommunities: null,
    myPools: null,
    watchers: {},
    cTokens: {},
    distributions: null,
    readonlyProvider: null,
    allPools: null,
    tokenDeploying: false,
    fees: {},
    // user deposit data
    depositDatas: {},
    // multicall get data
    pendingRewards: {},
    userStakings: {},
    approvements: {},
    userBalances: {},
    communityBalance: 1,
    ctokenApprovement: false,
    devAddress: "",
    devRatio: 0,
    ctokenBalances: {},

    // loading state
    loadingAllCommunities: false,
    loadingAllPools: true,
    loadingAllTokens: false,
    loadingPendingRewards: true,
    loadingApprovements: true,
    loadingUserStakings: true,
    loadingUserBalances: true,
    loadingCommunityBalance: true,
    loadingApprovementCtoken: true,
    loadingDevInfo: true,
    loadingCommunity: false,
    loadingCtokenBalances: true,
    loadingFees: true,

    //games
    games: null,

    // child community
    specifyDistributionEras: null
  },
  mutations: {
    saveEthers: (state, ethers) => {
      state.ethers = ethers;
    },
    saveAccount: (state, account) => {
      (state.account = account), Cookie.set("bsc-account", account, "30d");
    },
    saveWalnutInfo: (state, walnutInfo) => {
      state.walnutInfo = walnutInfo;
    },
    saveAllAccounts: (state, allAccounts) => {
      state.allAccounts = allAccounts;
    },
    saveAbi: (state, { name, abi }) => {
      state.abis[name] = abi;
    },
    saveChainId: (state, chainId) => {
      state.chainId = chainId;
    },
    saveStakingFactoryId: (state, stakingFactoryId) => {
      state.stakingFactoryId = stakingFactoryId;
    },
    saveAllAssetsOfUser: (state, allAssetsOfUser) => {
      state.allAssetsOfUser = allAssetsOfUser;
    },
    saveAllTokens: (state, allTokens) => {
      state.allTokens = allTokens;
      let icons = {}
      let decimals = {}
      let tokenByKey = {}
      for (let i in allTokens) {
        icons[allTokens[i].address.toLowerCase()] = allTokens[i].icon;
        decimals[allTokens[i].address.toLowerCase()] = allTokens[i].decimal;
        tokenByKey[allTokens[i].address.toLowerCase()] = allTokens[i]
      }
      state.tokenByKey = tokenByKey;
      state.tokenIcons = icons;
      state.tokenDecimals = decimals;
    },
    saveAllErc1155s: (state, allErc1155s) => {
      state.allErc1155s = allErc1155s
    },
    saveBlockNum: (state, blockNum) => {
      state.blockNum = blockNum;
    },
    saveNonce: (state, nonce) => {
      state.nonce = nonce;
    },
    saveAllCommunities: (state, communities) => {
      state.allCommunities = communities;
    },
    saveMyPools: (state, myPools) => {
      state.myPools = myPools;
    },
    saveWatchers: (state, watchers) => {
      state.watchers = watchers;
    },
    saveCTokens: (state, cTokens) => {
      state.cTokens = cTokens;
    },
    saveDistributions: (state, distributions) => {
      state.distributions = distributions;
    },
    saveReadonlyProvider: (state, readonlyProvider) => {
      state.readonlyProvider = readonlyProvider;
    },
    saveAllPools: (state, allPools) => {
      state.allPools = allPools;
    },
    saveDepositedDatas: (state, depositDatas) => {
      state.depositDatas = depositDatas;
    },
    saveTokenDeploying: (state, tokenDeploying) => {
      state.tokenDeploying = tokenDeploying;
    },
    saveFees: (state, fees) => {
      state.fees = fees
    },

    savePendingRewards: (state, pendingRewards) => {
      state.pendingRewards = pendingRewards;
    },
    saveApprovements: (state, approvements) => {
      state.approvements = approvements;
    },
    saveLoadingPendingRewards: (state, loadingPendingRewards) => {
      state.loadingPendingRewards = loadingPendingRewards;
    },
    saveLoadingApprovements: (state, loadingApprovements) => {
      state.loadingApprovements = loadingApprovements;
    },
    saveLoadingAllPools: (state, loadingAllPools) => {
      state.loadingAllPools = loadingAllPools;
    },
    saveLoadingAllCommunities: (state, loadingAllCommunities) => {
      state.loadingAllCommunities = loadingAllCommunities
    },
    saveLoadingAllTokens: (state, loadingAllTokens) => {
      state.loadingAllTokens = loadingAllTokens
    },
    saveLoadingUserStakings: (state, loadingUserStakings) => {
      state.loadingUserStakings = loadingUserStakings;
    },
    saveUserStakings: (state, userStakings) => {
      state.userStakings = userStakings;
    },
    saveUserBalances: (state, userBalances) => {
      state.userBalances = userBalances;
    },
    saveLoadingUserBalances: (state, loadingUserBalances) => {
      state.loadingUserBalances = loadingUserBalances;
    },
    saveLoadingCommunityBalance: (state, loadingCommunityBalance) => {
      state.loadingCommunityBalance = loadingCommunityBalance;
    },
    saveCommunityBalance: (state, communityBalance) => {
      state.communityBalance = communityBalance;
    },
    saveLoadingApprovementCtoken: (state, loadingApprovementCtoken) => {
      state.loadingApprovementCtoken = loadingApprovementCtoken;
    },
    saveCtokenApprovement: (state, ctokenApprovement) => {
      state.ctokenApprovement = ctokenApprovement;
    },
    saveLoadingDevInfo: (state, loadingDevInfo) => {
      state.loadingDevInfo = loadingDevInfo;
    },
    saveLoadingFees: (state, loadingFees) => {
      state.loadingFees = loadingFees
    },
    saveDevAddress: (state, devAddress) => {
      state.devAddress = devAddress;
    },
    saveDevRatio: (state, devRatio) => {
      state.devRatio = devRatio;
    },
    saveLoadingCommunity: (state, loadingCommunity) => {
      state.loadingCommunity = loadingCommunity;
    },
    saveLoadingCtokenBalances: (state, loadingCtokenBalances) => {
      state.loadingCtokenBalances = loadingCtokenBalances;
    },
    saveCtokenBalances: (state, ctokenBalances) => {
      state.ctokenBalances = ctokenBalances;
    },
    saveGames: (state, games) => {
      state.games = games;
    },
  },
  getters: {
    isMainChain: (state) => {
      return parseInt(state.chainId) === parseInt(BSC_CHAIN_ID);
    },
    tokenDecimals: (state) => (address) => {
      if (!ethers.utils.isAddress(address)) return 18;
      return state.tokenDecimals[address.toLowerCase()] || 18
    },
    tokenIcons: (state) => (address) => {
      if (!ethers.utils.isAddress(address)) return;
      return state.tokenIcons[address.toLowerCase()]
    },
    tokenByKey: (state) => (address) => {
      if (!ethers.utils.isAddress(address)) return;
      return state.tokenByKey[address.toLowerCase()];
    },
    erc1155ByKey: (state) => (address, tokenid) => {
      if (!ethers.utils.isAddress(address)) return;
      return state.allErc1155s.filter(e => e.address === address && e.tokenid === tokenid)
    }
  },
};
