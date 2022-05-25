

export default {
    namespaced: true,
    state: {
        dappsInfo: []
    },
    mutations: {
        saveDappsInfo(state, dappsInfo) {
            state.dappsInfo = dappsInfo
        }
    },
    getters: {
        dappByAddress: (state) => (address) => {
            if (!address) return {};
            address = address.toLowerCase();
            for (let dapp of state.dappsInfo) {
                if (dapp.address.toLowerCase() === address) {
                    return dapp
                }
            }
        }
    }
}