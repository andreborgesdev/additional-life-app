"use client";

import { UserResponse } from "@/src/lib/api-client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const fetchUserBySupabaseId = async (
  supabaseId: string | null | undefined
): Promise<UserResponse | null> => {
  if (!supabaseId) {
    return null;
  }

  const res = await fetch(`/api/users/supabase/${supabaseId}`);
  if (res.status === 404) {
    return null;
  }
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
};

export const getUserQueryOptions = (
  supabaseId: string | null | undefined
): UseQueryOptions<UserResponse | null, Error> => ({
  queryKey: ["userBySupabaseId", supabaseId],
  queryFn: () => fetchUserBySupabaseId(supabaseId),
  enabled: !!supabaseId,
  staleTime: 5 * 60 * 1000, // 5 minutes
  retry: (failureCount, error) => {
    if (error.message.toLowerCase().includes("not found")) {
      return false;
    }
    return failureCount < 3;
  },
});

export const useUserBySupabaseId = (supabaseId: string | null | undefined) => {
  return useQuery<UserResponse | null, Error>(getUserQueryOptions(supabaseId));
};
