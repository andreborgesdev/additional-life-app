"use client";

import { useQuery } from "@tanstack/react-query";
import { PageItemResponse } from "../lib/api-client";

export interface UseItemsProps {
  page?: number;
  size?: number;
  sortBy?: SortBy;
  direction?: QueryDirection;
  query?: string;
  category?: string;
  condition?: string;
}

export enum SortBy {
  // RELEVANCE = "postedOn",
  TITLE = "title",
  POSTED_ON = "postedOn",
}

export enum QueryDirection {
  ASC = "asc",
  DESC = "desc",
}

export const useItems = ({
  page,
  size,
  sortBy,
  direction,
  query,
  category,
  condition,
}: UseItemsProps) => {
  return useQuery<PageItemResponse>({
    queryKey: [
      "items",
      page,
      size,
      sortBy,
      direction,
      query,
      category,
      condition,
    ],
    queryFn: async () => {
      const queryPage = page === undefined ? 0 : page;
      const querySize = size === undefined ? 10 : size;
      const querySortBy = sortBy === undefined ? "postedOn" : sortBy;
      const queryDirection =
        direction === undefined ? QueryDirection.DESC : direction;

      const queryParams = new URLSearchParams({
        page: queryPage.toString(),
        size: querySize.toString(),
        sortBy: querySortBy,
        direction: queryDirection,
        ...(query && { query }),
        ...(category && { category }),
        ...(condition && { condition }),
      });

      const response = await fetch(`/api/items?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch items");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
