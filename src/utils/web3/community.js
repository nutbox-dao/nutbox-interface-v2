import { getContract, contractAddress } from './contract'
import { ethers } from 'ethers'
import store from '@/store'
import { Transaction_config } from '@/config'
import { getNonce as gn, getMyCommunityInfo as gci, insertCommunity, updateCommunity, getAllCommunities as gac } from '@/apis/api'
import { signMessage } from './utils'
import { errCode, Multi_Config } from '../../config'
import { waitForTx } from './ethers'
import {
    createWatcher
  } from '@makerdao/multicall'
import { getCToken } from './asset'
import { community } from '../../assets/lang/zh_CN'

/**
 * Get community admin's staking factory id
 * @returns
 */
export const getMyStakingFactory = async (update=false) => {
    return new Promise(async (resolve, reject) => {
        const id = store.state.web3.stakingFactoryId
        if (!update && id){
            resolve(id);
            return;
        }
        let contract;
        try{
            contract = await getContract('StakingFactory', null)
        }catch(e){
            reject(e);
            return
        }
        const account = store.state.web3.account
        let stakingFactoryId = null
        try{
            const count = await contract.stakingFeastCounter(account)
            if (count > 0){
                stakingFactoryId = await contract.stakingFeastRecord(account, 0)
            }else{
                store.commit('web3/saveStakingFactoryId', null)
                resolve(null);
                return;
            }
        }catch(e){
            reject(errCode.BLOCK_CHAIN_ERR)
            return;
        }
        console.log('community', stakingFactoryId);
        store.commit('web3/saveStakingFactoryId', stakingFactoryId)
        resolve(stakingFactoryId)
    })
}

/**
 * Get community's infos from backend
 * @param {*} update
 * @returns
 */
export const getMyCommunityInfo = async (update=false) => {
    return new Promise(async (resolve, reject) => {
        let stakingFactoryId = null
        try{
            stakingFactoryId = await getMyStakingFactory(update)
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY);
                return;
            }
        }catch(e){
            reject(e);
            return;
        }
        if (!update && store.state.web3.communityInfo){
            resolve(store.state.web3.communityInfo)
            return;
        }
        let communityInfo = null;
        try{
            communityInfo = await gci(stakingFactoryId)
            if (communityInfo){
                console.log('backend communityInfo', communityInfo);
                store.commit('web3/saveCommunityInfo', communityInfo)
                resolve(communityInfo)
                return;
            }else{
                console.log('first get communityInfo');
                store.commit('web3/saveCommunityInfo', {id: stakingFactoryId})
                resolve({id: stakingFactoryId})
            }
        }catch(e){
            store.commit('web3/saveCommunityInfo', null)
            reject(e)
        }
    })
}

/**
 * get all community infos
 */
export const getAllCommunities = async (update=false) => {
    return new Promise(async  (resolve, reject) => {
        if (!update && store.state.web3.allCommunities && store.state.web3.allCommunities.length > 0) {
            resolve(store.state.allCommunities)
            return;
        }
        try{
            const communities = await gac()
            store.commit('web3/saveAllCommunities', communities)
            resolve(communities)
        }catch(e){
            reject(e)
        }
    })
}

/**
 * Create Community Staking Factory Contracts
 * @param {*} form contract params
 */
export const createStakingFeast = async (form) => {
    return new Promise(async(resolve, reject) => {
        try{
            const comId = await getMyStakingFactory()
            console.log('comId');
            if (comId){
                console.log('Can only register one community for an account');
                reject(errCode.CONTRACT_CREATE_FAIL)
                return;
            }
        }catch(e) {
            reject(e);
            return;
        }

        let contract;
        try{
            contract = await getContract('StakingFactory', null, false)
        }catch(e){
            reject(e);
            return;
        }
        
        try{
            // make params
            const assetId = form.assetId
            let distribution = form.poolData
            distribution = distribution.map(d => ({
                amount: ethers.utils.parseUnits(d.amount.toString(), form.decimal),
                startHeight: d.startHeight,
                stopHeight: d.stopHeight
            }))
            // call contract
            const res = await contract.createStakingFeast(assetId, distribution, Transaction_config)
            await waitForTx(res.hash)
            resolve(res.hash)
        }catch(e){
            console.log('Create Staking Feast Failed', e);
            reject(errCode.BLOCK_CHAIN_ERR)
            return;
        }
    })
}

/**
 * Create or update community info to backend
 * @param {*} form
 */
export const completeCommunityInfo = async (form, type) => {
    return new Promise(async (resolve, reject) => {
        let nonce = await getNonce()
        const userId = store.state.web3.account
        nonce = nonce ? nonce + 1 : 1
        const originMessage = JSON.stringify(form)
        let signature = ''
        try{
            signature = await signMessage(originMessage + nonce)
        }catch(e){
            if (e.code === 4001){
                reject(errCode.USER_CANCEL_SIGNING);
                return;
            }
        }
        const params = {
            userId,
            infoStr: originMessage,
            nonce,
            signature
        }
        try{
            let res = null;
            if (type === 'edit'){
                res  = await updateCommunity(params)
            }else{
                res = await insertCommunity(params)
            }
            // update nonce in storage
            store.commit('web3/saveNonce', nonce)
            resolve(res)
        }catch(e) {
            console.log('Insert community info failed', e);
            reject(e)
        }
    })

}

/**
 * Get cToken distribuitons eras
 * @param {*} update 
 */
export const getDistributionEras = async (update=false) => {
    return new Promise(async (resolve, reject) => {
        const distribuitons = store.state.web3.distributions;
        if (!update && distribuitons) {
            resolve(distribuitons)
        }

        let stakingFactoryId = null
        try{
            stakingFactoryId = await getMyStakingFactory()
            if (!stakingFactoryId) {
                reject(errCode.NO_STAKING_FACTORY);
                return;
            }
        }catch(e){
            reject(e);
            return;
        }

        let contract;
        let decimal;
        try{
            contract = await getContract('StakingTemplate', stakingFactoryId)
            const cToken = await getCToken(stakingFactoryId)
            console.log(776, cToken);
            decimal = cToken.decimal
        }catch(e){
            reject(e);
            return;
        }

        try{
            const count = await contract.numberOfDistributionEras()
            let distri = await Promise.all((new Array(count).toString().split(',')).map((item, i) => contract.distributionEras(i)))
            distri = distri.map((item, i) => ({
                percentage: item.stopHeight - item.startHeight,
                amount: item.amount.toString() / (10 ** decimal),
                startHeight: item.startHeight.toString(),
                stopHeight: item.stopHeight.toString(),
                background: `rgba(80, 191, 0, ${(i+1)*(1.0 / count)})`
            }))
            console.log('distribituions', distri);
            store.commit('web3/saveDistributions', distri)
            resolve(distri)
        }catch(e){
            reject(e);
            return
        }
    })
}

/**
 * Get User's nonce
 * @param {*} update
 */
export const getNonce = async (update=false) => {
    let nonce = store.state.web3.nonce
    const account = store.state.web3.account
    if (!update && nonce) {
        return nonce
    }
    nonce = await gn(account)
    store.commit('web3/saveNonce', nonce)
    return nonce
}

/**
 * monityor Community balance
 * If cToken of this community is not a mintable token, he may need to charge balance of community
 */
export const monitorCommunityBalance = async (communityInfo) => {
    const cToken = await getCToken(communityInfo.id)
    if (cToken.isMintable){
        return;
    }
    return new Promise(async (resolve, reject) => {
        try{
          store.commit('web3/saveLoadingCommunityBalance', true)
          let watchers = store.state.web3.watchers
          let watcher = watchers['communityBalance']
          watcher && watcher.stop()
          watcher = createWatcher([
              {
                  target: contractAddress['ERC20AssetHandler'],
                  call: [
                    'getBalance(bytes32)(uint256)',
                    ethers.utils.keccak256('0x' + communityInfo.id.substr(2) + cToken.assetId.substr(2) + "61646d696e")
                  ],
                  returns: [
                      ['communityBalance']
                  ]
              }
          ], Multi_Config)
          watcher.batch().subscribe(updates => {
            console.log('Updates community balance', communityBalance);
            store.commit('web3/saveLoadingCommunityBalance', false)
            store.commit('web3/saveCommunityBalance', updates[0]['communityBalance'])
          })
          watcher.start()
          watchers['communityBalance'] = watcher
          store.commit('web3/saveWatchers', {...watchers})
          resolve()
        }catch(e){
          reject()
        }
      })
}

export const monitorCommunity = async () => {
    let communityInfo;
    try{
        communityInfo = await getMyCommunityInfo(true)
        if (!communityInfo) {
            return;
        }
    }catch(e){
        return;
    }
    await Promise.all([
        monitorCommunityBalance(communityInfo)
    ]).catch(console.error)
}