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
      const queryPage = page === undefined ? 0 : page;
      const querySize = size === undefined ? 10 : size;
      const querySortBy = sortBy === undefined ? "postedOn" : sortBy;
      const queryDirection = direction === undefined ? "desc" : direction;

      const response = await fetch(
        `/api/items?page=${queryPage}&size=${querySize}&sortBy=${querySortBy}&direction=${queryDirection}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
