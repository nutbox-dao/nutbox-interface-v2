/**
 * My own community data
 */

import { ethers } from "ethers"

export default {
  namespaced: true,
  state: {
    // my community info data from backend
    communityInfo: null,
    // my community data from grapg
    communityData: null,
    // my ctoken distributions
    distributions: null,
    // loading flag
    loadingMyCommunityInfo: false,
    loadingAllCommunityInfo: false,
    loadingApproveCommunity: false,

    approvedCommunity: false,
    // all i joined community from graph
    joinedCommunityData: null,

    // all fetched community reward per block
    // communityId => int
    rewardPerBlock: {},


    // all community from backend
    allCommunityInfo: null,
  },
  mutations: {
    setUserDeployToken (state, data) {
      state.userDeployTokens.push(data)
      localStorage.setItem('userDeployTokens', JSON.stringify(state.userDeployTokens))
    },
    setUserDeployEconomy (state, data) {
      state.userEconomy = data
      localStorage.setItem('userDeployEconomy', JSON.stringify(data))
    },
    saveCommunityInfo (state, data) {
      state.communityInfo = data;
    },
    saveDistributions (state, distr) {
      state.distributions = distr
    },
    saveLoadingMyCommunityInfo (state, loadingMyCommunityInfo) {
      state.loadingMyCommunityInfo = loadingMyCommunityInfo;
    },
    saveLoadingAllCommunityInfo (state, loadingAllCommunityInfo) {
      state.loadingAllCommunityInfo = loadingAllCommunityInfo
    },
    saveRewardPerBlock (state, rewardPerBlock) {
      state.rewardPerBlock = rewardPerBlock
    },
    saveAllCommunityInfo (state, allCommunityInfo) {
      state.allCommunityInfo = allCommunityInfo
    },
    saveCommunityData (state, communityData) {
      state.communityData = communityData
    },
    saveJoinedCommunityData (state, joinedCommunityData) {
      state.joinedCommunityData = joinedCommunityData
    },
    saveLoadingApproveCommunity (state, loadingApproveCommunity) {
      state.loadingApproveCommunity = loadingApproveCommunity
    },
    saveApprovedCommunity (state, approvedCommunity) {
      state.approvedCommunity = approvedCommunity
    }
  },
  getters: {
    getCommunityInfoById: (state) => (communityId) => {
      if (!state.allCommunityInfo) return null
      communityId = communityId.toLowerCase();
      return state.allCommunityInfo[communityId]
    }
  }
}
