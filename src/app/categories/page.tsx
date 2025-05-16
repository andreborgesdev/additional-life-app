"use client";

import Link from "next/link";
import { useRootCategories } from "@/src/hooks/use-categories";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import Image from "next/image";
import { iconMap } from "@/src/components/home/categories";

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useRootCategories();

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner className="h-8 w-8 text-green-600" />
        <p className="mt-2 text-green-800 dark:text-green-200">
          Loading categories...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">
          Error loading categories: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
        Browse Categories
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories?.map((category) => {
          return (
            <Link
              key={category.id}
              href={{
                pathname: `/categories/${category.id}`,
                query: { name: category.name },
              }}
              className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              {category.imageUrl ? (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="rounded-full mb-3 object-cover"
                />
              ) : (
                <span className="text-4xl mb-3">
                  {iconMap.find((icon) => icon.name === category.name)?.icon}
                </span>
              )}
              <span className="text-green-800 dark:text-green-200 font-medium text-center">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
