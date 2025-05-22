// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "next-graphql-playground",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const { Nextjs } = sst.aws;
    const users = new sst.aws.Dynamo("GraphQLUsers", {
      fields: {
        id: "string",
        name: "string",
        email: "string",
        number: "number",
      },
      primaryIndex: { hashKey: "id" },
      globalIndexes: {
        nameIndex: { hashKey: "name" },
        emailIndex: { hashKey: "email" },
        numberIndex: { hashKey: "number" },
      },
    });
    new Nextjs("MyWeb", {
      environment: {
        USERS_TABLE_NAME: users.name,
      },
      link: [users],
    });
  },
});
