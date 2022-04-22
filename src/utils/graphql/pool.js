import { client, restClient } from './index';
import { USE_THE_GRAPH } from '@/config'
import store from '@/store'
import { gql } from 'graphql-request'
import { ethers } from 'ethers'

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
export async function getPools(poolIds) {
    const useTheGraph = USE_THE_GRAPH
    if (useTheGraph) {
        return await getPoolsFromGraph(poolIds)
    }else {
        return await getPoolsFromService(poolIds)
    }
}
async function getPoolsFromGraph(poolIds) {
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
                hasCreateGauge
                votedAmount
                voters(first: 10){
                    id
                }
                votersCount
            }
        }
    `
    try{
        const data = await client.request(query, {ids: poolIds})
        if (data && data.pools) {
            const pools = data.pools
            return pools
        }
    }catch(e) {
        console.log('Get community from graph fail:', e);
    }
}

async function getPoolsFromService(poolIds) {
    try{
        poolIds = '[' + poolIds.reduce((s, p) => s += ('"' + ethers.utils.getAddress(p) + '",'), '') + ']'
        const query = `{
            pools (id_In:${poolIds}) {
                edges{
                    node{
                        id
                        status
                        asset
                        poolFactory
                        totalAmount
                        ratio
                        name
                        chainId
                        stakers(first:10) {
                            edges{
                                node{
                                    id
                                }
                            }
                        }
                        stakersCount
                        community{
                            id
                            feeRatio
                            cToken
                        }
                        hasCreateGauge
                        votedAmount
                        voters(first: 10) {
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
        }`
        let data = await restClient.request(query)
        data = JSON.parse(data.value).pools.edges
        data = data.map(p => {
            let pool = p.node;
            pool.stakers = pool.stakers.edges.map(s => s.node)
            pool.voters = pool.voters.edges.map(v => v.node)
            pool.asset = pool.asset.substring(0, 2) !== "0x" ? '0x' + pool.asset : pool.asset
            return pool
        })
        return data
    }catch(e) {
        console.log(235, e);
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