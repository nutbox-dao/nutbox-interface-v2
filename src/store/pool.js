/**
 * pools info by monitor
 * will always be cleared when the page have no pools to show
 */

export default {
    namespaced: true,
    state: {
        totalStaked: null,
        userStaked: null,
        approvements: null,
        userReward: null,
        poolAprs: null,

        loadingApprovements: false,
    },
    mutations: {
        saveTotalStaked(state, totalStaked) {
            state.totalStaked = totalStaked
        },
        saveUserStaked(state, userStaked) {
            state.userStaked = userStaked
        },
        saveApprovements(state, approvements) {
            state.approvements = approvements
        },
        saveUserReward(state, userReward) {
            state.userReward = userReward
        },
        savePoolAprs(state, poolAprs) {
            state.poolAprs = poolAprs
        },

        saveLoadingApprovements(state, loadingApprovements) {
            state.loadingApprovements = loadingApprovements
        },

        clear(state) {
            state.totalStaked = null;
            state.userStaked = null;
            state.approvements = null;
            state.userReward = null;
            state.poolAprs = null;
            state.loadingApprovements = false;
        }
    }
}