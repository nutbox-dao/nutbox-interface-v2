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
                    feeRatio
                    cToken
                    usersCount
                    poolsCount
                    activedPoolCount
                }
                inPools {
                    id
                    name
                    poolFactory
                    community{
                        id
                    }
                    ratio
                    asset
                    chainId
                    stakersCount
                }
            }
        }
    `
    try{
        const userInfo = await client.request(query, {id: account.toLowerCase()});
        if (userInfo && userInfo.user) {
            store.commit('web3/saveUserGraphInfo', userInfo.user)
        }
        return;
    }catch(err) {
        console.log('Get my joined community fail', err);
    }
}