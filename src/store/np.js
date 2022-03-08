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
        // user
        balance: {},
        // 0-6 array
        userLockedNut: [],
        userRedeemInfo:[]
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

        // user
        saveBalance: (state, balance) => {
            state.balance = balance
        },
        saveUserLockedNut: (state, userLockedNut) => {
            state.userLockedNut = userLockedNut
        },
        saveUserRedeemInfo: (state, userRedeemInfo) => {
            state.userRedeemInfo = userRedeemInfo
        }
    }
}