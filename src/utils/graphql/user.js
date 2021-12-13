import { client } from './index';
import store from '@/store'
import { getAccounts } from '../web3/account';
import { gql } from 'graphql-request'

// get user summary: include all joined communities and pools
export async function getMyJoinedCommunity() {
    const account = await getAccounts();
    const query = gql`
        query getUser($id: String!) {
            user(id: $id) {
                createdAt
                inCommunities {
                    id
                    feeRatio
                    cToken
                    usersCount
                    poolsCount
                    activedPoolCount
                }
                inPools {
                    id
                    name
                    poolFactory
                    community{
                        id
                    }
                    ratio
                    asset
                    chainId
                    stakersCount
                }
            }
        }
    `
    try{
        const userInfo = await client.request(query, {id: account.toLowerCase()});
        if (userInfo && userInfo.user) {
            store.commit('web3/saveUserGraphInfo', userInfo.user)
        }
        return;
    }catch(err) {
        console.log('Get my joined community fail', err);
    }
}


/**
 * get current user's community
 * @param {*} community 
 * @returns 
 */
 export async function getMyCommunityData() {
    if (store.state.web3.stakingFactoryId) {
        const query = gql`
            query Community($id: String!) {
                community(id: $id) {
                    id
                    feeRatio
                    pools(orderBy: poolIndex) {
                        id
                        status
                        name
                        asset
                        poolFactory
                        poolIndex
                        ratio
                        chainId
                        stakersCount,
                        totalAmount
                    }
                }
            }
        `
        try{
            const data = await client.request(query, {id: store.state.web3.stakingFactoryId.toLowerCase()})
            if (data && data.community) {
                const community = data.community
                store.commit('community/saveCommunityData', community)
                console.log('my community data', community);
                return community
            }
        }catch(e) {
            console.log('Get my community data from graph fail:', e);
        }
    }
    return {}
}

// fetch first 100 history of user
export async function getNewUserStakingHistory(account) {
    const query = gql`
        query getHistory($id: String!) {
            user(id: $id) {
                stakingHistory(orderBy: timestamp, orderDirection: desc, first: 100) {
                    type 
                    community
                    poolFactory
                    pool
                    asset
                    chainId
                    amount
                    tx
                    timestamp
                }
            }
        }
    `
    try{
        const user = await client.request(query, {id: account.toLowerCase()});
        if (user && user.stakingHistory) {
            return user.stakingHistory
        }
    }catch(e) {
        console.log("Load more user's history fail:", e);
    }
}

// fetch new staking records of user
export async function updateStakingHistory(account, timestamp) {
    const query = gql`
        query fetchNewHistory($id: String!, $lasttime: Int!) {
            user(id: $id) {
                stakingHistory(orderBy: timestamp, orderDirection: desc, where:{timestamp_gt: $lasttime}) {
                    type 
                    community
                    poolFactory
                    pool
                    asset
                    chainId
                    amount
                    tx
                    timestamp
                }
            }
        }
    `
    try{
        const user = await client.request(query, {id: accout.toLowerCase(), lasttime: parseInt(timestamp)});
        if (user && user.stakingHistory) {
            return user.stakingHistory
        }
    }catch(e) {
        console.log("Fetch new user's history fail:", e);
    }
}

// fetch more user's staking history
export async function getMoreStakingHistory(account, timestamp) {
    const query = gql`
        query getHistory($id: String!, $lasttime:Int!) {
            user(id: $id) {
                stakingHistory(orderBy: timestamp, orderDirection: desc, first: 20, where:{timestamp_lt:$lasttime}) {
                    type 
                    community
                    poolFactory
                    pool
                    asset
                    chainId
                    amount
                    tx
                    timestamp
                }
            }
        }
    `
    try{
        const user = await client.request(query, {id: accout.toLowerCase(), lasttime: parseInt(timestamp)});
        if (user && user.stakingHistory) {
            return user.stakingHistory
        }
    }catch(e) {
        console.log("Load more user's history fail:", e);
    }
}