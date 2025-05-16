"use client";

import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "../lib/generated-api";

export const useUserBySupabaseId = (supabaseId: string | null) => {
  return useQuery<UserResponse, Error>({
    queryKey: ["userBySupabaseId", supabaseId],
    queryFn: async () => {
      if (!supabaseId) {
        throw new Error(
          "Supabase ID is required to fetch user details but was null or empty."
        );
      }

      const res = await fetch(`/api/user/supabase/${supabaseId}`);
      if (!res.ok) {
        const errorData = await res
          .json()
          .catch(() => ({ message: "Failed to fetch user by Supabase ID" }));
        throw new Error(
          errorData.message ||
            `Failed to fetch user by Supabase ID with status: ${res.status}`
        );
      }
      return res.json();
    },
    enabled: !!supabaseId,
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
