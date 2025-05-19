"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemResponse } from "../../lib/api-client";

export const useItem = (itemId: string | null) => {
  return useQuery<ItemResponse, Error>({
    queryKey: ["item", itemId],
    queryFn: async () => {
      if (!itemId) {
        throw new Error(
          "Item ID is required to fetch item details but was null or empty."
        );
      }

      const res = await fetch(`/api/items/${itemId}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
    enabled: !!itemId, // Only run the query if itemId is a truthy value
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    retry: (failureCount, error) => {
      // Do not retry if the error message indicates "not found" or a 404 type error
      if (
        error.message.toLowerCase().includes("not found") ||
        error.message.includes("404")
      ) {
        return false;
      }
      // Otherwise, retry up to 3 times
      return failureCount < 3;
    },
  });
};
