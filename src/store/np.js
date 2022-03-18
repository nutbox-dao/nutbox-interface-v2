/**
 * nut power
 */

 export default {
    namespaced: true,
    state: {
        // common
        totalSupply: 0,
        totalLockedNut:0,
        npPrice: 0,
        npApr: 0,
        commonData: [],
        // user
        balance: {},
        // 0-6 array
        userLockedNut: [],
        userRedeemInfo:[],
        loadingRedeemInfo: true,
    },
    mutations: {
        // common
        saveTotalSupply:(state, totalSupply) => {
            state.totalSupply = totalSupply
        },
        saveTotalLockedNut: (state, totalLockedNut) => {
            state.totalLockedNut = totalLockedNut
        },
        saveNpPrice: (state, npPrice) => {
            state.npPrice = npPrice
        },
        saveNpApr: (state, npApr) => {
            state.npApr = npApr
        },
        saveCommonData(state, commonData){
            state.commonData = commonData
        },

        // user
        saveBalance: (state, balance) => {
            state.balance = balance
        },
        saveUserLockedNut: (state, userLockedNut) => {
            state.userLockedNut = userLockedNut
        },
        saveUserRedeemInfo: (state, userRedeemInfo) => {
            state.userRedeemInfo = userRedeemInfo
        },
        saveLoadingRedeemInfo: (state, loadingRedeemInfo) => {
            state.loadingRedeemInfo = loadingRedeemInfo
        }
    }
}