import { gql } from "graphql-tag";

export const typeDefs = gql`
  type Query {
    hello: String
    getUsers(limit: Int, nextToken: String): UserPage
  }

  type User {
    id: String!
    name: String!
    email: String
    number: Int
  }

  type UserPage {
    users: [User]
    nextToken: String
  }

  type Mutation {
    addUser(name: String!, email: String!, number: Int!): User
  }
`;