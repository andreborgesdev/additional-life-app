"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useCategoryById, useSubcategories } from "@/src/hooks/use-categories";
import { CategoryResponse } from "@/src/lib/generated-api";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { name?: string };
}) {
  const {
    data: subcategories,
    isLoading: isLoadingSubcategories,
    error,
  } = useSubcategories(params.id);

  const categoryNameFromQuery = searchParams?.name;

  if (isLoadingSubcategories) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <LoadingSpinner className="h-8 w-8 text-green-600" />
        <p className="mt-2 text-green-800 dark:text-green-200">
          Loading category details...
        </p>
      </div>
    );
  }

  if (error) {
    return <p>Error loading category: {error.message}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href="/categories"
        className="flex items-center text-green-600 hover:text-green-700 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        Back to categories
      </Link>
      <h1 className="text-3xl font-bold text-green-800 dark:text-green-200 mb-8">
        {categoryNameFromQuery || "Category"}
      </h1>
      {subcategories?.map((subcategory) => (
        <Link
          key={subcategory.id}
          href={`/categories/${subcategory.id}`}
          className="block mb-4 text-green-600 hover:text-green-700"
        >
          {subcategory.name}
        </Link>
      ))}
      {/* {categoryItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map((item) => (
            <Link key={item.id} href={`/items/${item.id}`} className="block">
              <div className="bg-white dark:bg-green-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
                <Image
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                    {item.title}
                  </h3>
                  <button className="mt-2 px-4 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors">
                    View Item
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600 dark:text-gray-400">
          No items found in this category.
        </p>
      )} */}
    </div>
  );
}
