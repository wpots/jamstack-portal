import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: { __schema: { types: [] } },
});
// HTTP connection to the API
const httpLink = new HttpLink({
  uri: `https://graphql.contentful.com/content/v1/spaces/o4cfwi1cgj8a`,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer nX8vnHHV2ByZwnWDcnaXzccLIBx5X9BzQEZAH6Zyaqw`,
    },
  });
  return forward(operation);
});
// Cache implementation
const cache = new InMemoryCache({ fragmentMatcher });

// Create the apollo client
const apolloClient = new ApolloClient({
  link: concat(authMiddleware, httpLink),
  cache,
});

export default apolloClient;
