import { client } from './index';
import store from '@/store'
import { gql } from 'graphql-request'

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
export async function getPools(poolIds) {
    const query = gql`
        query Pools($ids: [String]) {
            pools (where: {id_in: $ids}) {
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
                    feeRatio
                    cToken
                }
            }
        }
    `
    try{
        const data = await client.request(query, {ids: poolIds})
        if (data && data.pools) {
            const pools = data.pools
            store.commit('currentCommunity/saveAllPools', pools)
            return pools
        }
    }catch(e) {
        console.log('Get community from graph fail:', e);
    }
}

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
 export async function getAllPools() {
    let allPools = []
    let createdAt = parseInt((new Date().getTime()) / 1e3).toString()
    while(true) {
        const data = await getPoolsByCreate(createdAt)
        allPools = allPools.concat(data)
        if (data.length < 1000) {
            break;
        }
        createdAt = data[data.length - 1].createdAt
    }
    return allPools
}

async function getPoolsByCreate(createdAt) {
    const query = gql`
    query Pools($createdAt: String!) {
        pools(where: {status: OPENED, createdAt_lt: $createdAt}, first: 1000, orderBy:createdAt, orderDirection: desc){
            id
            asset
            chainId
            totalAmount
            createdAt
        }
    }
    `
    try{
        const data = await client.request(query,{createdAt})
        if (data && data.pools) {
            const pools = data.pools
            return pools
        }
    }catch(e) {
        console.log('Get community from graph fail:', e);
        return []
    }
}