import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const link = new HttpLink({ uri: "/api/graphql" });

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;
