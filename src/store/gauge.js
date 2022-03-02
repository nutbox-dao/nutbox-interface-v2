/**
 * gauge
 */

 export default {
    namespaced: true,
    state: {
        gaugeRatio: 0,
        // nut reward per block to gauge
        nutRewardPerBlock: 0,
        // distribtuion ratio of NUT to community/poolFactory/user
        distributionRatio: {},
        totalLocked:{},
        hasCreated: {},

        // user's info
        userLocked: {},
        userReward: {}
    },
    mutations: {
        saveGaugeRatio: (state, gaugeRatio) => {
            state.gaugeRatio = gaugeRatio
        },
        saveNutRewardPerBlock: (state, nutRewardPerBlock) => {
            state.nutRewardPerBlock = nutRewardPerBlock
        },
        saveDistributionRatio: (state, distributionRatio) => {
            state.distributionRatio = distributionRatio
        },
        saveHasCreated: (state, hasCreated) => {
            state.hasCreated = hasCreated
        },
        saveUserLockeed: (state, userLocked) => {
            state.userLocked = userLocked
        },
        saveTotalLocked: (state, totalLocked) => {
            state.totalLocked = totalLocked
        },
        saveUserReward: (state, userReward) => {
            state.userReward = userReward
        }
    }
}