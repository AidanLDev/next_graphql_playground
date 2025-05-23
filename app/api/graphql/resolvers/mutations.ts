import { nanoid } from "nanoid";
import { docClient } from "@/lib/dynamo";
import { PutCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";

export const Mutation = {
  addUser: async (
    _: unknown,
    { name, email, number }: { name: string; email: string; number: number }
  ) => {
    // Check if user with the same email exists
    const existingUserResponse = await docClient.send(
      new ScanCommand({
        TableName: process.env.USERS_TABLE_NAME,
        FilterExpression: "#email = :email",
        ExpressionAttributeNames: { "#email": "email" },
        ExpressionAttributeValues: { ":email": email },
        Limit: 1,
      })
    );

    if (existingUserResponse.Items && existingUserResponse.Items.length > 0) {
      throw new Error("User with this email already exists.");
    }

    const newUser = {
      id: nanoid(),
      name,
      email,
      number,
    };

    await docClient.send(
      new PutCommand({
        TableName: process.env.USERS_TABLE_NAME,
        Item: newUser,
      })
    );
    return newUser;
  },
};
