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
        saveCommunityPendingRewardNut: 0,

        // user's info
        userLocked: {},
        userRewardNut: {},
        userRewardCtoken: {}
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
        saveCommunityPendingRewardNut: (state, communityPendingRewardNut) => {
            state.communityPendingRewardNut = communityPendingRewardNut
        },
        saveUserLocked: (state, userLocked) => {
            state.userLocked = userLocked
        },
        saveTotalLocked: (state, totalLocked) => {
            state.totalLocked = totalLocked
        },
        saveUserRewardNut: (state, userRewardNut) => {
            state.userRewardNut = userRewardNut
        },
        saveUserRewardCtoken: (state, userRewardCtoken) => {
            state.userRewardCtoken = userRewardCtoken
        }
    }
}