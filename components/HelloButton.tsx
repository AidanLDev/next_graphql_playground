"use client"

import React from "react";
import { gql, useLazyQuery } from "@apollo/client";

const HELLO_QUERY = gql`
  query Hello {
    hello
  }
`;

export default function HelloButton() {
  const [getHello, { loading, error, data }] = useLazyQuery(HELLO_QUERY);
  return (
    <div>
      <button
        onClick={() => getHello()}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Say Hello
      </button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && <p>Response: {data.hello}</p>}
    </div>
  );
}
