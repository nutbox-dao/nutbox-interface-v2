import {
  client,
  restClient
} from './index';
import store from '@/store'
import {
  gql
} from 'graphql-request'
import {
  USE_THE_GRAPH
} from '@/config';
import { ethers } from 'ethers';
import { parseOperationStructure } from './utils'

export async function getSpecifyCommunityInfo(community) {
  const useTheGraph = USE_THE_GRAPH
  if (useTheGraph) {
    return await getSpecifyCommunityInfoFromTheGraph(community)
  } else {
    return await getSpecifyCommunityInfoFromOurService(community)
  }
}

export async function getNewCommunityOPHistory(community) {
    const useTheGraph = USE_THE_GRAPH
    if (useTheGraph) {
        return await getNewCommunityOPHistoryFromTheGraph(community)
    } else {
        return await getNewCommunityOPHistoryFromOurService(community)
    }
}

export async function getUpdateCommunityOPHistory(community) {
    const useTheGraph = USE_THE_GRAPH
    if (useTheGraph) {
        return await getUpdateCommunityOPHistoryFromTheGraph(community)
    } else {
        return await getUpdateCommunityOPHistoryFromOurService(community)
    }
}

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
async function getSpecifyCommunityInfoFromTheGraph(community) {
  const query = gql `
        query Community($id: String!) {
            community(id: $id) {
                id
                createdAt
                feeRatio
                cToken
                daoFund
                treasury
                retainedRevenue
                owner{
                    id
                }
                pools {
                    id
                    status
                    name
                    asset
                    poolFactory
                    totalAmount
                    ratio
                    chainId
                    stakers(first: 10){
                        id
                    }
                    stakersCount
                    community{
                        id
                    }
                    hasCreateGauge
                    votedAmount
                    voters(first: 10){
                        id
                    }
                    votersCount
                }
                users {
                    id
                    createdAt
                    address
                    operationCount
                }
                operationCount
                operationHistory(first: 60, orderBy: timestamp, orderDirection: desc) {
                  id
                    type
                    timestamp
                    poolFactory
                    pool{
                        id
                        name
                    }
                    user
                    chainId
                    asset
                    amount
                    timestamp
                    tx
                }
            }
        }
    `
  try {
    store.commit('currentCommunity/saveLoadingCommunityInfo', true)
    const data = await client.request(query, {
      id: community.toLowerCase()
    })
    if (data && data.community) {
      const community = data.community
      store.commit('currentCommunity/saveCommunityInfo', community)
      return community
    }
  } catch (e) {
    console.log('Get community from graph fail:', e);
  } finally {
    store.commit('currentCommunity/saveLoadingCommunityInfo', false)
  }
}

async function getSpecifyCommunityInfoFromOurService(community) {
  try {
    community = ethers.utils.getAddress(community)
    const query = `
    {
      community(id: "${community}") {
        id
        createdAt
        feeRatio
        cToken
        daoFund
        retainedRevenue
        treasury
        owner{
            id
        }
        pools {
            edges{
                node{
                    id
                    status
                    name
                    asset
                    poolFactory
                    totalAmount
                    ratio
                    chainId
                    stakers(first: 10){
                        edges{
                            node{
                                id
                            }
                        }
                    }
                    stakersCount
                    community{
                        id
                    }
                    hasCreateGauge
                    votedAmount
                    voters(first: 10){
                        edges{
                            node{
                                id
                            }
                        }
                    }
                    votersCount
                }
            }
        }
        users {
          edges{
            node{
              id
              createdAt
              address
              operationCount
            }
          }
        }
        operationCount
      }
    }
  `
    store.commit('currentCommunity/saveLoadingCommunityInfo', true)
    let [data, history] = await Promise.all([restClient.request(query), getNewCommunityOPHistoryFromOurService(community)])
    data = JSON.parse(data.value).community
    data.pools = data.pools.edges.map(p => {
        let pool = p.node
        pool.stakers = pool.stakers.edges.map(s => s.node)
        pool.voters = pool.voters.edges.map(v => v.node)
        return pool
    })
    data.users = data.users.edges.map(u => u.node)
    data.operationHistory = history
    store.commit('currentCommunity/saveCommunityInfo', data)
    return data
  } catch (e) {
    console.log('Get community from our service fail:', e);
  } finally {
    store.commit('currentCommunity/saveLoadingCommunityInfo', false)
  }
}

// get specify community's op history
async function getNewCommunityOPHistoryFromTheGraph(community) {
  const query = gql `
        query getOperationHistory($id: String!) {
            userOperationHistories(where: {community: $id}, first: 100, orderBy: timestamp, orderDirection: desc){
                type
                id
                community{
                    id
                }
                pool{
                    id
                    name
                }
                poolFactory
                chainId
                asset
                amount
                tx
                user
                timestamp
            }
        }
    `
  try {
    const userOperationHistories = await client.request(query, {
      id: community.toLowerCase()
    })
    if (userOperationHistories && userOperationHistories.userOperationHistories.length > 0) {
      if (userOperationHistories.userOperationHistories[0].community.id === store.state.currentCommunity.communityId.toLowerCase()) {
        store.commit('currentCommunity/saveOperationHistory', userOperationHistories.userOperationHistories)
      }
    }
    return;
  } catch (err) {
    console.log('Get op history fail', err);
  }
}

async function getNewCommunityOPHistoryFromOurService(community) {
    try{
        community = ethers.utils.getAddress(community)
        const query = `
            {
                userOperationHistories(community:"${community}", first: 100,orderBy:"timestamp", orderDirection: "desc"){
                    edges {
                        cursor
                        node {
                        id
                        type
                        community {
                            id
                        }
                        pool{
                            id
                            name
                        }
                        poolFactory
                        chainId
                        asset
                        amount
                        tx
                        user{
                            id
                        }
                        timestamp
                        }
                    }
                }
            }
        `
        let data = await restClient.request(query)
        data = parseOperationStructure(data)
        store.commit('currentCommunity/saveOperationHistory', data)
        return data;
    }catch (err) {
        console.log('Get new community history fail:', err);
    }
}

async function getUpdateCommunityOPHistoryFromTheGraph(community) {
  const query = gql `
        query getOperationHistory($id: String!, $timestamp: Int!) {
            userOperationHistories(where: {community: $id, timestamp_gt: $timestamp}, first: 20, orderBy: timestamp, orderDirection: desc){
                id
                type
                community{
                    id
                }
                pool{
                    id
                    name
                }
                poolFactory
                chainId
                asset
                amount
                tx
                user
                timestamp
            }
        }
    `
  const existHistory = store.state.currentCommunity.operationHistory
  if (!existHistory || existHistory.length === 0) {
    await getNewCommunityOPHistory(community);
    return
  }
  const lastTime = existHistory[0].timestamp;
  try {
    let newOps = await client.request(query, {
      id: community.toLowerCase(),
      timestamp: parseInt(lastTime)
    });
    if (newOps && newOps.userOperationHistories && newOps.userOperationHistories.length > 0) {
      if (newOps.userOperationHistories[0].community.id === store.state.currentCommunity.communityId.toLowerCase()) {
        store.commit('currentCommunity/saveOperationHistory', newOps.userOperationHistories.concat(existHistory));
      }
    } else {
      // console.log('no update');
    }
  } catch (err) {
    console.log('Get op history from the graph fail', err);
  }
}

async function getUpdateCommunityOPHistoryFromOurService(community) {
    try{
        community = ethers.utils.getAddress(community)
        const existHistory = store.state.currentCommunity.operationHistory
        let data;
        if (!existHistory || existHistory.length === 0) {
            data = await getNewCommunityOPHistory(community);
            return data;
        }
        const timestamp = existHistory[0].timestamp;
        const query = `{
            userOperationHistories(community:"${community}",first: 20,
            orderBy:"timestamp", orderDirection: "desc", 
            timestamp_Gt:${timestamp}){
                edges{
                    cursor
                    node{
                        id
                        type
                        community{
                            id
                        }
                        pool{
                            id
                            name
                        }
                        poolFactory
                        chainId
                        asset
                        amount
                        tx
                        user{
                            id
                        }
                        timestamp
                    }
                }
            }
        }`
        data = await restClient.request(query)
        data = parseOperationStructure(data);
        if (data.length > 0 && data[0].community.id.toLowerCase() === store.state.currentCommunity.communityId.toLowerCase()) {
            store.commit('currentCommunity/saveOperationHistory', data.concat(existHistory));
        }
    }catch(err) {
        console.log('Get new history from service fail', err);
    }
}

export async function getMoreCommunityOPHistory(community) {
  const query = gql `
        query getOperationHistory($id: String!, $timestamp: Int!) {
            userOperationHistories(where: {community: $id, timestamp_lt: $timestamp}, first: 20, orderBy: timestamp, orderDirection: desc) {
                type
                community{
                    id
                }
                pool{
                    id
                    name
                }
                poolFactory
                chainId
                asset
                amount
                tx
                user
                timestamp
            }
        }
    `
  const oldHistory = store.state.currentCommunity.operationHistory
  if (!oldHistory || oldHistory.length === 0) {
    await getNewCommunityOPHistory(community);
    return
  }
  const lastTime = oldHistory[oldHistory.length - 1].timestamp;
  try {
    let newOps = await client.request(query, {
      id: community.toLowerCase(),
      timestamp: parseInt(lastTime)
    });
    if (newOps && newOps.userOperationHistories && newOps.userOperationHistories.length > 0) {
      if (newOps.userOperationHistories[0].community.id === store.state.currentCommunity.communityId.toLowerCase()) {
        store.commit('currentCommunity/saveOperationHistory', oldHistory.concat(newOps.userOperationHistories));
      }
    } else {
      console.log('no update');
    }
  } catch (err) {
    console.log('Get op history fail', err);
  }
}