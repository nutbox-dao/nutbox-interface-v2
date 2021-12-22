import { getEthWeb } from './web3.js'
import store from '@/store'
import {  getMyCommunityInfo, getNonce, getDistributionEras } from './community'
import { getRegitryAssets, monitorCtokenBalance } from './asset.js'
import { ethers } from 'ethers'
import { updateUserInfo as uui, getSomeUsers, getAllUsers } from '@/apis/api'
import { sleep } from '../helper.js'
import { errCode, BSC_CHAIN_ID } from '@/config.js'
import { signMessage } from './utils'

/**
 * Get metamask accounts
 * @returns all accounts
 */
export const getAccounts = async (update=false) => {
    if (store.state.web3.account && !update) {
        return store.state.web3.account;
    }
    const chainId = store.state.chainId;
    if (chainId && (parseInt(chainId) !== parseInt(BSC_CHAIN_ID))) {
        store.commit('web3/saveAccount', null)
        return;
    }
    const metamask = await getEthWeb()
    const accounts = await metamask.request({ method: 'eth_requestAccounts' })
    let account = accounts[0]
    account = ethers.utils.getAddress(account)
    store.commit('web3/saveAccount', account)
    store.commit('web3/saveAllAccounts', accounts)
    return accounts[0]
}

/**
 * Monitor BSC account change event
 */
export const accountChanged = async (refresh) => {
    const metamask = await getEthWeb()
    metamask.on('accountsChanged', (accounts) => {
        console.log('Changed accounts', accounts);
        store.commit('web3/saveAccount', ethers.utils.getAddress(accounts[0]))
        refresh();
        return;
        store.commit('web3/saveAccount', ethers.utils.getAddress(accounts[0]))
        store.commit('web3/saveStakingFactoryId', null)
        store.commit('web3/saveMyPools', null)
        store.commit('web3/saveAllAssetsOfUser', null)
        store.commit('web3/saveCommunityInfo', null)
        getRegitryAssets(true)
        getMyCommunityInfo(true).then(res => {
            if (res){
                getNonce(true)
                getDistributionEras(true)
            }
        }).catch(console.error)
        monitorCtokenBalance(true)
    })
}

export const updateAllUsersByPolling = async () => {
    while(true) {
        await getUsers()
        await sleep(10)
    }
}

/**
 * Get users by ids from backend
 * @param {*} users get all if users is null
 */
export const getUsers = async (users)  => {
    return new Promise(async (resolve, reject) => {
        while(store.state.user.loadingUsers) {
            await sleep(0.3)
        }
        store.commit('user/saveLoadingUsers', true);
        try{
            let originInfo = store.state.user.users ?? {};
            let news;
            if (users) {
                news = await getSomeUsers(users)
            }else {
                news = await getAllUsers()
            }
            for (let i = 0; i < news.length; i++){
                originInfo[news[i].id] = news[i]
            }
            store.commit('user/saveUsers', originInfo)
        }catch(e) {
            reject(errCode.SERVER_ERR)
        }finally{
            store.commit('user/saveLoadingUsers', false);
        }
    })
}

/**
 * get a user's base info: name, avatar
 * @param {*} user 
 * @returns 
 */
export const getUserBaseInfo = async (user) => {
    return new Promise(async (resolve, reject) => {
        try{
            while(store.state.user.loadingUsers) {
                await sleep(0.3)
            }
            user = ethers.utils.getAddress(user)
            const info = store.getters['user/getUserByAddress'](user)
            if (info){
                resolve(info)
            }else {
                const res = await getSomeUsers([user])
                if (res && res.length > 0){
                    resolve(res[0])
                    const originInfo = store.state.user.users;
                    originInfo[user] = res[0]
                    store.commit('user/saveUsers', originInfo)
                    return;
                }
                resolve(null)
            }
        }catch(e){
            console.log('Get user info fail:', e);
            reject(errCode)
        }
    })
}

/**
 * update user's name and avatar
 * @param {*} form {avatar, name}
 * @returns 
 */
export const updateUserInfo = async (form) => {
    return new Promise(async (resolve, reject) => {
        const userId = await getAccounts(); 
        let nonce = await getNonce();
        const originMessage = JSON.stringify(form);
        let signature = "";
        nonce = nonce ? nonce + 1 : 1;
    
        try {
          signature = await signMessage(originMessage + nonce);
        } catch (e) {
          if (e.code === 4001) {
            reject(errCode.USER_CANCEL_SIGNING);
            return;
          }
        }
    
        const params = {
            userId,
            infoStr: originMessage,
            nonce,
            signature,
        };
        try {
            let res = await uui(params)
            // update nonce in storage
            store.commit("web3/saveNonce", nonce);
            resolve(res);
        } catch (e) {
            console.log("update user info failed", e);
            reject(e);
        }
    })
}