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
                    owner{
                        id
                    }
                    feeRatio
                    cToken
                    usersCount
                    poolsCount
                    activedPoolCount
                }
                inPools {
                    id
                    name
                    status
                    poolFactory
                    community{
                        id
                        cToken
                        feeRatio
                    }
                    ratio
                    asset
                    chainId
                    stakersCount
                    totalAmount
                }
                inGauges {
                    id
                    name
                    status
                    community{
                        id
                        cToken
                        feeRatio
                    }
                    ratio,
                    asset,
                    votersCount,
                    votedAmount
                }
            }
        }
    `
    try{
        const userInfo = await client.request(query, {id: account.toLowerCase()});
        if (userInfo && userInfo.user) {
            store.commit('user/saveUserGraphInfo', userInfo.user)
        }
        store.commit('user/saveLoadingUserGraph', false)
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
                    daoFund
                    retainedRevenue
                    owner{
                        id
                    }
                    cToken
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
                        totalAmount,
                        hasCreateGauge,
                        voters,
                        votersCount,
                        votedAmount
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

// fetch first 500 history of user in specify community
export async function getNewUserStakingHistory(account, community) {
    const query = gql`
        query getHistory($id: String!, $community: String!) {
            user(id: $id) {
                operationHistory(where:{community: $community},orderBy: timestamp, orderDirection: desc, first: 500) {
                    type 
                    user
                    community{
                        id
                    }
                    poolFactory
                    pool{
                        id
                        name
                    }
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
        const user = await client.request(query, {id: account.toLowerCase(), community: community.toLowerCase()});
        if (user && user.user && user.user.operationHistory) {
            return user.user.operationHistory
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
                operationHistory(orderBy: timestamp, orderDirection: desc, where:{timestamp_gt: $lasttime}) {
                    type 
                    user
                    community{
                        id
                    }
                    poolFactory
                    pool{
                        id
                        name
                    }
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
        const user = await client.request(query, {id: account.toLowerCase(), lasttime: parseInt(timestamp)});
        if (user && user.user && user.user.operationHistory) {
            return user.user.operationHistory
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
                    user
                    community{
                        id
                    }
                    poolFactory
                    pool{
                        id
                        name
                    }
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
        const user = await client.request(query, {id: account.toLowerCase(), lasttime: parseInt(timestamp)});
        if (user && user.user && user.user.operationHistory) {
            return user.user.operationHistory
        }
    }catch(e) {
        console.log("Load more user's history fail:", e);
    }
}