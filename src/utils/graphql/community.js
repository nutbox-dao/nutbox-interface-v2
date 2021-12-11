import { client } from './index';
import store from '@/store'
import { gql } from 'graphql-request'

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
export async function getSpecifyCommunityInfo(community) {
    const query = gql`
        query Community($id: String!) {
            community(id: $id) {
                id
                createdAt
                feeRatio
                cToken
                pools {
                    id
                    status
                    name
                    asset
                    poolFactory
                    ratio
                    chainId
                    stakers(first: 10){
                        id
                    }
                    stakersCount
                }
                operationCount
                operationHistory(first: 60, orderBy: timestamp, orderDirection: desc) {
                    type
                    timestamp
                    poolFactory
                    pool
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
    try{
        store.commit('currentCommunity/saveLoadingCommunityInfo' ,true)
        const data = await client.request(query, {id: community.toLowerCase()})
        if (data && data.community) {
            const community = data.community
            store.commit('currentCommunity/saveCommunityInfo', community)
            return community
        }
    }catch(e) {
        console.log('Get community from graph fail:', e);
    }finally{
        store.commit('currentCommunity/saveLoadingCommunityInfo' ,false)
    }
}

// get specify community's op history
export async function getNewCommunityOPHistory(community) {
    const query = gql`
        query getOperationHistory($id: String!) {
            userOperationHistories(where: {community: $id}, first: 100, orderBy: timestamp, orderDirection: desc){
                type
                community{
                    id
                }
                pool{
                    id
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
    try{
        const userOperationHistories = await client.request(query, {id: community.toLowerCase()})
        if (userOperationHistories && userOperationHistories.userOperationHistories) {
            store.commit('currentCommunity/saveOperationHistory', userOperationHistories.userOperationHistories)
        }
        return;
    }catch(err) {
        console.log('Get op history fail', err);
    }
}

export async function getUpdateCommunityOPHistory(community) {
    const query = gql`
        query getOperationHistory($id: String!, $timestamp: Int!) {
            userOperationHistories(where: {community: $id, timestamp_gt: $timestamp}, first: 20, orderBy: timestamp, orderDirection: desc){
                type
                community{
                    id
                }
                pool{
                    id
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
    if (!existHistory || existHistory.length === 0){
        await getNewCommunityOPHistory(community);
        return
    }
    const lastTime = existHistory[0].timestamp;
    try{
        let newOps = await client.request(query, { id: community.toLowerCase(), timestamp: parseInt(lastTime) });
        if (newOps && newOps.userOperationHistories && newOps.userOperationHistories.length > 0){
            store.commit('currentCommunity/saveOperationHistory', newOps.userOperationHistories.concat(existHistory));
        }else {
            // console.log('no update');
        }
    }catch(err) {
        console.log('Get op history fail', err);
    }
}

export async function getMoreCommunityOPHistory(community) {
    const query = gql`
        query getOperationHistory($id: String!, $timestamp: Int!) {
            userOperationHistories(where: {community: $id, timestamp_lt: $timestamp}, first: 20, orderBy: timestamp, orderDirection: desc) {
                type
                community{
                    id
                }
                pool{
                    id
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
    if (!oldHistory || oldHistory.length === 0){
        await getNewCommunityOPHistory(community);
        return
    }
    const lastTime = oldHistory[oldHistory.length - 1].timestamp;
    try{
        let newOps = await client.request(query, {id: community.toLowerCase(), timestamp: parseInt(lastTime)});
        if (newOps && newOps.userOperationHistories && newOps.userOperationHistories.length > 0){
            store.commit('currentCommunity/saveOperationHistory', oldHistory.concat(newOps.userOperationHistories));
        }else {
            console.log('no update');
        }
    }catch(err) {
        console.log('Get op history fail', err);
    }
}