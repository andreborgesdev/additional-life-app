"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemResponse } from "@/src/lib/generated-api";

export const useUserItems = () => {
  return useQuery<ItemResponse[], Error>({
    queryKey: ["user-items"],
    queryFn: async () => {
      const response = await fetch(`/api/items/user`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user items");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
