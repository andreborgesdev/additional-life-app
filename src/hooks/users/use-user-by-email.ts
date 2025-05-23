"use client";

import { useQuery } from "@tanstack/react-query";
import { UserResponse } from "@/src/lib/generated-api";

const QUERY_KEY_PREFIX = "user";
const STALE_TIME = 5 * 60 * 1000;
const MAX_RETRIES = 3;

interface FetchUserError extends Error {
  status?: number;
}

const fetchUserByEmail = async (email: string): Promise<UserResponse> => {
  const encodedEmail = encodeURIComponent(email);
  const response = await fetch(`/api/users?email=${encodedEmail}`);

  if (!response.ok) {
    const error = new Error() as FetchUserError;
    error.status = response.status;

    try {
      const errorData = await response.json();
      error.message =
        errorData.message || `HTTP ${response.status}: Failed to fetch user`;
    } catch {
      error.message = `HTTP ${response.status}: Failed to fetch user`;
    }

    throw error;
  }

  return response.json();
};

const shouldRetry = (failureCount: number, error: FetchUserError): boolean => {
  if (failureCount >= MAX_RETRIES) return false;

  const isNotFoundError =
    error.status === 404 || error.message.toLowerCase().includes("not found");

  return !isNotFoundError;
};

export const useUserByEmail = (email: string | null) => {
  return useQuery<UserResponse, FetchUserError>({
    queryKey: [QUERY_KEY_PREFIX, "email", email],
    queryFn: () => {
      if (!email?.trim()) {
        throw new Error("Email is required to fetch user details");
      }
      return fetchUserByEmail(email.trim());
    },
    enabled: Boolean(email?.trim()),
    staleTime: STALE_TIME,
    retry: shouldRetry,
  });
};
