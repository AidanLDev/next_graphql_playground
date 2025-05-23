import gql from "graphql-tag";

export const ADD_USER_MUTATION = gql`
  mutation AddUser($name: String!, $email: String!, $number: Int!) {
    addUser(name: $name, email: $email, number: $number) {
      id
      name
      email
      number
    }
  }
`;
