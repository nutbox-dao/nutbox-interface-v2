/**
 * nut power
 */

 export default {
    namespaced: true,
    state: {
        totalSupply: 0,
        totalLockedNut:0,
        npPrice: 0
    },
    mutations: {
        saveTotalSupply:(state, totalSupply) => {
            state.totalSupply = totalSupply
        },
        saveTotalLockedNut: (state, totalLockedNut) => {
            state.totalLockedNut = totalLockedNut
        },
        saveNpPrice: (state, npPrice) => {
            state.npPrice = npPrice
        }
    }
}