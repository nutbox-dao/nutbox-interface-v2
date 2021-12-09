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
    // community op list
    communityHistory: {},
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
    saveCommunityHistory (state, data) {
      state.communityHistory[data.community] = data.history;
      state.commityHistory = {...state.communityHistory};
    },
    saveCommunityInfo (state, data) {
      state.communityInfo = data;
    },
    saveDistributions (state,distr) {
      state.distributions = distr
    }
  },
  getters: {
    getCommunityOPHistory: (state) => (community) => {
     return state.communityHistory[community];
    }
  }
}
