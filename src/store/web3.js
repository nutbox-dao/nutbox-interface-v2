import Cookie from "vue-cookies";
import { BSC_CHAIN_ID } from "@/config";
import { ASSET_LOGO_URL } from "@/constant";

export default {
  namespaced: true,
  state: {
    ethers: null,
    walnutInfo: {},
    account: Cookie.get("bsc-account"),
    userGraphInfo: {},
    allAccounts: [],
    abis: {},
    chainId: -1,
    stakingFactoryId: null,
    allAssetsOfUser: null,
    allTokens: null,
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
    // user deposit data
    depositDatas: {},
    // multicall get data
    pendingRewards: {},
    userStakings: {},
    approvements: {},
    monitorPools: {},
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
    loadingCommunity: true,
    loadingCtokenBalances: true,

    // proposal
    proposals: null,
    communityProposalConfig: null,
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
    saveUserGraphInfo: (state, userGraphInfo) => {
      state.userGraphInfo = userGraphInfo;
    },
    saveAbi: (state, { name, abi }) => {
      state[name] = abi;
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
      for (let i in allTokens) {
        icons[allTokens[i].address.toLowerCase()] = allTokens[i].icon;
      }
      state.tokenIcons = icons;
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
    saveMonitorPools: (state, monitorPools) => {
      state.monitorPools = monitorPools;
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
    saveProposals: (state, proposals) => {
      state.proposals = proposals;
    },
    saveCommunityProposalConfig: (state, communityProposalConfig) => {
      state.communityProposalConfig = communityProposalConfig;
    },
    saveGames: (state, games) => {
      state.games = games;
    },
  },
  getters: {
    isMainChain: (state) => {
      return parseInt(state.chainId) === parseInt(BSC_CHAIN_ID);
    },
  },
};
