"use client";

import React, { useEffect } from "react";
import { useLazyQuery } from "@apollo/client";
import { GET_USERS_QUERY } from "@/graphql/queries/users";

interface User {
  id: string;
  name: string;
  email: string;
  number: string;
}

interface GetUsersData {
  getUsers: {
    users: User[];
    nextToken?: string | null;
  };
}

export default function ShowUsers() {
  const [fetchedUsers, setFetchedUsers] = React.useState(false);

  const [getUsers, { loading, error, data }] =
    useLazyQuery<GetUsersData>(GET_USERS_QUERY);

  useEffect(() => {
    if (!fetchedUsers && !loading) {
      getUsers({ variables: { limit: 100 } });
      setFetchedUsers(true);
    }
  }, [fetchedUsers, getUsers, loading]);

  const handleLoadMoreUsers = () => {
    if (data?.getUsers.nextToken) {
      getUsers({
        variables: { limit: 100, nextToken: data.getUsers.nextToken },
      });
    }
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <ul>
          {data.getUsers.users.map(({ id, name, email, number }) => (
            <li key={id}>
              {name} - {email} - {number}
            </li>
          ))}
        </ul>
      )}
      {data?.getUsers?.nextToken && (
        <button onClick={handleLoadMoreUsers}>Load More Users</button>
      )}
    </div>
  );
}
