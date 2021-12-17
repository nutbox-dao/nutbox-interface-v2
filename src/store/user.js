import { ethers } from "ethers";

export default {
    namespaced: true,
    state: {
        users: null,
        // loading all users from backend
        loadingUsers: false
    },
    getters: {
        getUserByAddress: state => (address) => {
            address = ethers.utils.getAddress(address)
            return state.users ? state.users[address] : null;
        },
    },
    mutations: {
        saveUsers(state, users) {
            state.users = users
        },
        saveLoadingUsers(state, loadingUsers) {
            state.loadingUsers = loadingUsers
        }
    }
}