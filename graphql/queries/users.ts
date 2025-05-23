import gql from "graphql-tag";

export const GET_USERS_QUERY = gql`
  query GetUsers($limit: Int, $nextToken: String) {
    getUsers(limit: $limit, nextToken: $nextToken) {
      users {
        id
        name
        email
        number
      }
      nextToken
    }
  }
`;
