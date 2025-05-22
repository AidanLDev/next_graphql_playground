import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import { gql } from "graphql-tag";
import { nanoid } from "nanoid";
import { docClient } from "@/lib/dynamo";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Resource } from "sst";

const typeDefs = gql`
  type Query {
    hello: String
  }

  type User {
    id: String!
    name: String!
    email: String
    number: Int
  }

  type Mutation {
    addUser(name: String!, email: String!, number: Int!): User
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hello world!",
  },
  Mutation: {
    addUser: async (
      _: unknown,
      { name, email, number }: { name: string; email: string; number: number }
    ) => {
      console.log("All env vars:", Resource.GraphQLUsers.name);
      console.log("env vars?: ", process.env.USERS_TABLE_NAME);
      const newUser = {
        id: nanoid(),
        name,
        email,
        number,
      };

      await docClient.send(
        new PutCommand({
          TableName: Resource.GraphQLUsers.name,
          Item: newUser,
        })
      );
      return newUser;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export async function GET(req: Request): Promise<Response> {
  return handler(req);
}

export async function POST(req: Request): Promise<Response> {
  return handler(req);
}
