import { client } from './index';
import store from '@/store'
import { gql } from 'graphql-request';

export async function getWalnutData() {
    const query = gql`
    {
        walnuts(first: 1) {
            stakeAssets
            cTokens
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