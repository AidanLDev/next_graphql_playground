"use client";

import React from "react";
import { useMutation } from "@apollo/client";
import { ADD_USER_MUTATION } from "@/graphql/mutations/users";

export default function AddUser() {
  const [addUserMutation, { loading, error }] = useMutation(ADD_USER_MUTATION);

  const addUser = async (formData: FormData) => {
    const userObject = Object.fromEntries(formData.entries());
    console.log("user: ", userObject);
    try {
      await addUserMutation({
        variables: {
          name: userObject.name,
          email: userObject.email,
          number: parseInt(userObject.number as string, 10),
        },
      });
    } catch (err) {
      console.error("Error adding user: ", err);
    }
  };

  return (
    <form action={addUser}>
      {error && <p>Error: {error.message}</p>}
      <div>
        <label htmlFor="name">Name</label>
        <input name="name" id="name" />
      </div>
      <div>
        <label htmlFor="email">Email</label>
        <input name="email" id="email" />
      </div>
      <div>
        <label htmlFor="number">Number</label>
        <input name="number" id="number" />
      </div>
      <button type="submit" disabled={loading}>
        Submit
      </button>
    </form>
  );
}
