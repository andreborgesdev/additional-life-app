"use client";

import { useQuery } from "@tanstack/react-query";
import { PageItemResponse } from "../lib/api-client";

export interface UseItemsProps {
  page?: number;
  size?: number;
  sortBy?: "title" | "category" | "postedOn";
  direction?: "asc" | "desc";
}

export const useItems = ({ page, size, sortBy, direction }: UseItemsProps) => {
  return useQuery<PageItemResponse>({
    queryKey: ["items", page, size, sortBy, direction],
    queryFn: async () => {
      const response = await fetch(
        `/api/items?page=${page}&size=${size}&sortBy=${sortBy}&direction=${direction}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
