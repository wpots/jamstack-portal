import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client/core";

// HTTP connection to the API
const httpLink = createHttpLink({
  // You should use an absolute URL here
  // uri: '/.netlify/functions/content',
  uri: "/api/v1/content",
});

// Cache implementation
const cache = new InMemoryCache();

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
});

export default apolloClient;

/* run netlify dev to debug locally */
