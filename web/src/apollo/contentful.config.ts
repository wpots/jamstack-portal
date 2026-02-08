import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloLink, concat } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData: { __schema: { types: [] } },
});

const contentfulSpaceId =
  import.meta.env.VUE_APP_CONTENTFUL_SPACE_ID ||
  import.meta.env.VITE_CONTENTFUL_SPACE_ID;
const contentfulAccessToken =
  import.meta.env.VUE_APP_CONTENTFUL_ACCESS_TOKEN ||
  import.meta.env.VITE_CONTENTFUL_ACCESS_TOKEN;

// HTTP connection to the API
const httpLink = new HttpLink({
  uri: `https://graphql.contentful.com/content/v1/spaces/${contentfulSpaceId}`,
});

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: `Bearer ${contentfulAccessToken}`,
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
