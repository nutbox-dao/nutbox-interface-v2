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