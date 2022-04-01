import { client, restClient } from './index';
import { USE_THE_GRAPH } from '@/config';
import store from '@/store'
import { getAccounts } from '../web3/account';
import { gql } from 'graphql-request'
import { ethers } from 'ethers';

// get user summary: include all joined communities and pools
export async function getMyJoinedCommunity() {
    const useTheGraph = USE_THE_GRAPH;
    if (useTheGraph) {
        return await getMyJoinedCommunityFromGraph()
    }else {
        return await getMyJoinedCommunityFromService()
    }
}

async function getMyJoinedCommunityFromGraph() {
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
        console.log('Get my joined community from graph fail', err);
    }
}

async function getMyJoinedCommunityFromService() {
    const account = await getAccounts();
    try {
        const query = `{
            user(id:"${account}") {
                createdAt
                inCommunities {
                    edges{
                        node{
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
                    }
                }
                inPools {
                    edges{
                        node{
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
                    }
                }
                inGauges {
                    edges{
                        node{
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
            }
        }`
        let data = await restClient.request(query)
        data = JSON.parse(data.value).user
        if (data){
            data.inCommunities = data.inCommunities.edges.map(c => c.node)
            data.inGauges = data.inGauges.edges.map(c => c.node)
            data.inPools = data.inPools.edges.map(c => c.node)
            store.commit('user/saveUserGraphInfo', data);
        }
        store.commit('user/saveLoadingUserGraph', false)
    }catch(e) {
        console.log('Get my joined community from service fail', e);
    }
}

/**
 * get current user's community
 * @param {*} community 
 * @returns 
 */
 export async function getMyCommunityData() {
    const useTheGraph = USE_THE_GRAPH;
    if (useTheGraph) {
        return await getMyCommunityDataFromGraph()
    }else {
        return await getMyCommunityDataFromService()
    }
}

async function getMyCommunityDataFromGraph() {
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

async function getMyCommunityDataFromService() {
    if (store.state.web3.stakingFactoryId) {
        try{
            const communityId = ethers.utils.getAddress(store.state.web3.stakingFactoryId)
            const query = `
                {
                    community(id: "${communityId}") {
                        id
                        feeRatio
                        daoFund
                        retainedRevenue
                        owner{
                            id
                        }
                        cToken
                        pools {
                            edges{
                                node{
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
                                    votersCount,
                                    votedAmount
                                }
                            }
                        }
                    }
                }
            `
            let data = await restClient.request(query)
            data = JSON.parse(data.value).community;
            data.pools = data.pools.edges.map(c => c.node).sort((a,b) => a.poolIndex - b.poolIndex)
            store.commit('community/saveCommunityData', data)
            return data;
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