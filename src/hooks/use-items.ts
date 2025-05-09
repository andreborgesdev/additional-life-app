"use client";

import { useQuery } from "@tanstack/react-query";
import { ItemResponse, PageItemResponse } from "../lib/api-client";

export const useItems = () => {
  return useQuery<PageItemResponse>({
    queryKey: ["items"],
    queryFn: async () => {
      const response = await fetch("/api/items");
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
