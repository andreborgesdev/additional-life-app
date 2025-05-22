"use client";

import Link from "next/link";
import { useRootCategories } from "@/src/hooks/use-categories";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import Image from "next/image";
import { Skeleton } from "@/src/components/ui/skeleton";

function CategoryCardSkeleton() {
  return (
    <div className="dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center">
      <Skeleton className="h-20 w-20 rounded-full mb-3" />
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

function CategoriesPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-9 w-1/3 mb-8" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <CategoryCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function CategoriesPage() {
  const { data: categories, isLoading, error } = useRootCategories();

  if (isLoading && !categories) {
    return <CategoriesPageSkeleton />;
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

  const sortedCategories = categories
    ? [...categories].sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
        Browse Categories
      </h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {sortedCategories?.map((category) => {
          return (
            <Link
              key={category.id}
              href={{
                pathname: `/items`,
                query: { categoryId: category.id },
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
