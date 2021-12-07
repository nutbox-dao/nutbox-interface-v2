import { request, gql, GraphQLClient } from 'graphql-request';
import store from '@/store'
export function test() {
    console.log('0x3d67A8926F097a1304eAF9Dc985fd00533Fa56C5'.toLowerCase());
    const query = gql`
        {
            communities(first: 5) {
                id
                createdAt
                feeRatio
                cToken
                distributedCToken
                revenue
                usersCount
                poolsCount
                activedPoolCount
                users(first: 5) {
                id
                }
                pools(first: 5) {
                id
                }
                manageHistory(first: 5) {
                type
                timestamp
                }
            }
        }
    `
    const graphQLClient = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutingoerli');

    graphQLClient.request(query).then((res) => console.log(123, res)).catch(err => console.log('err', err))
}