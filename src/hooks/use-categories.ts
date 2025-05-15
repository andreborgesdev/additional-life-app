"use client";

import { useQuery } from "@tanstack/react-query";
import { CategoryResponse } from "../lib/api-client";

export const useFeaturedCategories = () => {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ["featuredCategories"],
    queryFn: async () => {
      const response = await fetch("/api/categories/featured");
      if (!response.ok) {
        throw new Error("Failed to fetch featured categories");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

export const useCategories = () => {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};

export const useCategoryById = (categoryId: string) => {
  return useQuery<CategoryResponse, Error>({
    queryKey: ["category", categoryId],
    queryFn: async () => {
      if (!categoryId) {
        throw new Error("Category ID is required to fetch category details.");
      }
      const response = await fetch(`/api/categories/${categoryId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch category");
      }
      return response.json();
    },
    enabled: !!categoryId, // Only run the query if categoryId is a truthy value
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useSubcategories = (categoryParentId: string) => {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ["subcategories", categoryParentId],
    queryFn: async () => {
      if (!categoryParentId) {
        throw new Error("Parent ID is required to fetch subcategories.");
      }
      const response = await fetch(
        `/api/categories/${categoryParentId}/subcategories`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch subcategories");
      }
      return response.json();
    },
    enabled: !!categoryParentId, // Only run the query if parentId is a truthy value
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useRootCategories = () => {
  return useQuery<CategoryResponse[], Error>({
    queryKey: ["rootCategories"],
    queryFn: async () => {
      const response = await fetch("/api/categories/root");
      if (!response.ok) {
        throw new Error("Failed to fetch root categories");
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // cache for 5 minutes
  });
};
