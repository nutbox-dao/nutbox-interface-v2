import { client, restClient } from './index';
import { USE_THE_GRAPH } from '@/config'
import store from '@/store'
import { gql } from 'graphql-request'
import { ethers } from 'ethers'
import { getPools as gp } from '@/apis/api';

/**
 * Get a specify community info 
 * @param {*} community 
 * @returns 
 */
export async function getPools(poolIds) {
    return await getPoolsFromApi(poolIds)
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
            return pool
        })
        return data
    }catch(e) {
        console.log(235, e);
    }
}

async function getPoolsFromApi(poolIds) {
    const data = await gp(poolIds)
    return data
}