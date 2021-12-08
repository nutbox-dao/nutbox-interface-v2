import { client } from './index';
import store from '@/store'
import { gql } from 'graphql-request'


// get user summary: include all joined communities and pools
export async function getNewCommunityOPHistory(community) {
    const query = gql`
        query getManagerHistory($id: String!) {
            community(id: $id) {
                manageHistory(orderBy: timestamp, orderDirection: asc, first: 10){
                    type
                    amount
                    pool
                    tx
                    timestamp
                }
            }
        }
    `
    try{
        const manageHistory = await client.request(query, {id: community.toLowerCase()})
        if (manageHistory && manageHistory.manageHistory) {
            
        }
        return;
    }catch(err) {
        console.log('Get my joined community fail', err);
    }
}