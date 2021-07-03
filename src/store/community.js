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
    userEconomy: getUserEconomy()
  },
  mutations: {
    setUserDeployToken (state, data) {
      state.userDeployTokens.push(data)
      localStorage.setItem('userDeployTokens', JSON.stringify(state.userDeployTokens))
    },
    setUserDeployEconomy (state, data) {
      state.userEconomy = data
      localStorage.setItem('userDeployEconomy', JSON.stringify(data))
    }
  }
}
