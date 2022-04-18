import {
  GraphQLClient
} from 'graphql-request';

// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinchapel');
export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinbsc');
// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutingoerli');
// export  const client = new GraphQLClient('https://api.thegraph.com/subgraphs/name/terryyyyyy/walnutinmbase');
// export  const client = new GraphQLClient('https://walnut-graph.nutbox.app/subgraphs/name/terryyyyyyy/walnutingoerli');
// export  const client = new GraphQLClient('https://walnut-graph.nutbox.app/subgraphs/name/terryyyyyyy/walnutingoerli');

// rest-ful from our service
export const restClient = new GraphQLClient('https://center-rest.nutbox.app/v1/common/search')
// export const restClient = new GraphQLClient('/rest-graph')
