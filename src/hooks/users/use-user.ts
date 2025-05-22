"use client";

import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/src/lib/generated-api";

export const useUser = (userId: string | null) => {
  return useQuery<UserResponse, Error>({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error(
          "User ID is required to fetch user details but was null or empty."
        );
      }

      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to fetch user" }));
        throw new Error(
          errorData.message || `Failed to fetch user with status: ${res.status}`
        );
      }
      return res.json();
    },
    enabled: !!userId,
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
  });
};
