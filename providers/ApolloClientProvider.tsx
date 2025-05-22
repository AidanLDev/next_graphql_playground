"use client";

import React from "react";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";

export default function ApolloClientProvider({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
