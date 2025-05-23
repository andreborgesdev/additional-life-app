"use client";

import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/src/lib/generated-api";

export const fetchUserByEmail = async (
  email: string | null
): Promise<UserResponse | null> => {
  if (!email) {
    throw new Error(
      "Email is required to fetch user details but was null or empty."
    );
  }

  const res = await fetch(`/api/users?email=${email}`);

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to fetch user" }));
    throw new Error(
      errorData.message || `Failed to fetch user with status: ${res.status}`
    );
  }
  return res.json();
};

const getUserQueryOptions = (email: string | null) => {
  return {
    queryKey: ["user", email],
    queryFn: () => fetchUserByEmail(email),
    enabled: !!email,
    staleTime: 5 * 60 * 1000,
    retry: (failureCount, error) => {
      if (
        error.message.toLowerCase().includes("not found") ||
        error.message.includes("404")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  };
};

export const useUserByEmail = (email: string | null) => {
  return useQuery<UserResponse, Error>(getUserQueryOptions(email));
};
