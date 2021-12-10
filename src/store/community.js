const getUserDeployTokens = () => {
  const t = localStorage.getItem('userDeployTokens')
  if (!t) return []
  return JSON.parse(t)
}

const getUserEconomy = () => {
  const t = localStorage.getItem('userDeployEconomy')
  if (!t) return null
  return JSON.parse(t)
}

export default {
  namespaced: true,
  state: {
    userDeployTokens: getUserDeployTokens(),
    userEconomy: getUserEconomy(),
    // my community info data
    communityInfo: null,
    distributions: null,
    loadingMyCommunityInfo: false,
    // all community from backend
    allCommunityInfo: null,
    // all i joined community from graph
    joinedCommunityData: null
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
