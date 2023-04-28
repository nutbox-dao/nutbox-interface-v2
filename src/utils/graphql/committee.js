import { client, restClient } from './index';
import store from '@/store'
import { gql } from 'graphql-request';
import { USE_THE_GRAPH } from '@/config'

export async function getWalnutData() {
    if (USE_THE_GRAPH) {
        return await getWalnutDataFromTheGraph()
    }else {
        return await getWalnutDataFromOurService()
    }
}

async function getWalnutDataFromTheGraph() {
    const query = gql`
    {
        walnuts(first: 1) {
            totalUsers
            totalPools
            totalCommunities
        }
    }
    `
    try{
        const walnut = await client.request(query);
        if (walnut && walnut.walnuts && walnut.walnuts.length !== 0) {
            store.commit('web3/saveWalnutInfo', walnut.walnuts[0])
        }
        return;
    }catch(err) {
        console.log('Get walnut info fail', err)
    }
}

async function getWalnutDataFromOurService() {
    const query = gql`
        {
           walnuts(first: 1) {
               edges{
                   node{
                    totalUsers
                    totalPools
                    totalCommunities
                   }
               }
           }
        }
    `
    try {
        let walnut = await restClient.request(query);
        walnut = JSON.parse(walnut.value)
        walnut = walnut.walnuts.edges[0].node
        store.commit('web3/saveWalnutInfo', walnut)
    }catch(err) {
        console.log('Get walnut info fail', err)
    }
}