import {
  GraphQLClient
} from 'graphql-request';

// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinchapel');
export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinbsc');
// export const client = new GraphQLClient('https://api.thegraph.com/subgraphs/id/QmfZgxmoS2nV5GC94h7BP35yuurrpLWMCdnzGeKVoqRY52')
// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutingoerli');
// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinmbase');
// export  const client = new GraphQLClient('https://walnut-graph.nutbox.app/subgraphs/name/terryyyyyyy/walnutingoerli');
// export  const client = new GraphQLClient('https://walnut-graph.nutbox.app/subgraphs/name/terryyyyyyy/walnutingoerli');

// rest-ful from our service
export const restClient = new GraphQLClient('https://enuls-graph.nutbox.app/v1/common/search')
// export const restClient = new GraphQLClient('/rest-graph')
 