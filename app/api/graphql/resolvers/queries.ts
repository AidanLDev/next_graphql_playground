import { docClient } from "@/lib/dynamo";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

export const Query = {
  hello: () => "Hello world!",
  getUsers: async (
    _: unknown,
    { limit, nextToken }: { limit?: number; nextToken?: string }
  ) => {
    const params: {
      TableName: string | undefined;
      Limit?: number;
      ExclusiveStartKey?: Record<string, unknown>;
    } = {
      TableName: process.env.USERS_TABLE_NAME,
      Limit: limit,
    };
    if (nextToken) {
      params.ExclusiveStartKey = JSON.parse(
        Buffer.from(nextToken, "base64").toString("utf-8")
      );
    }
    const response = await docClient.send(new ScanCommand(params));
    return {
      users: response.Items,
      nextToken: response.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(response.LastEvaluatedKey)).toString(
            "base64"
          )
        : null,
    };
  },
};
