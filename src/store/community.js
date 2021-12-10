
export default {
  namespaced: true,
  state: {
    // my community info data from backend
    communityInfo: null,
    distributions: null,
    loadingMyCommunityInfo: false,
    // all i joined community from graph
    joinedCommunityData: null,
    // my community data from grapg
    communityData: null,
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
    saveAllCommunityInfo (state, allCommunityInfo) {
      state.allCommunityInfo = allCommunityInfo
    },
    saveCommunityData (state, communityData) {
      state.communityData = communityData
    },
    saveJoinedCommunityData (state, joinedCommunityData) {
      state.joinedCommunityData = joinedCommunityData
    }
  },
  getters: {
    getCommunityInfoById: (state) => (communityId) => {
      return state.allCommunityInfo[communityId]
    }
  }
}
