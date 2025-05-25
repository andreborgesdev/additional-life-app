"use client";

import Link from "next/link";
import {
  Recycle,
  Truck,
  Shirt,
  Book,
  Coffee,
  Tv,
  Sofa,
  Utensils,
  Briefcase,
  Palette,
  Leaf,
  Dumbbell,
  ArrowRight,
} from "lucide-react";
import { useFeaturedCategories } from "../../hooks/use-categories";
import { Button } from "@/src/components/ui/button";
import { Skeleton } from "@/src/components/ui/skeleton";
import Image from "next/image";
import { useTranslation } from "react-i18next";

function CategoryCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center">
      <Skeleton className="h-10 w-10 rounded-full mb-3" />{" "}
      {/* Icon placeholder */}
      <Skeleton className="h-4 w-20 mb-1" /> {/* Category name placeholder */}
      <Skeleton className="h-3 w-16" /> {/* Item count placeholder */}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <Skeleton className="h-8 w-1/3" /> {/* Title placeholder */}
          <Skeleton className="h-8 w-36" /> {/* View All button placeholder */}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <CategoryCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Categories() {
  const { t } = useTranslation("common");
  const { data: categories, isLoading, error } = useFeaturedCategories();

  if (isLoading) {
    return <CategoriesSkeleton />;
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          {t("home_categories.browse_categories_title")}
        </h2>
        <p className="text-red-500 text-center">
          {t("home_categories.error_loading_categories")}
        </p>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          {t("home_categories.browse_categories_title")}
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          {t("home_categories.no_categories_found")}
        </p>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
            {t("home_categories.browse_categories_title")}
          </h2>
          <Button
            asChild
            variant="ghost"
            className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
          >
            <Link href="/categories">
              {t("home_categories.view_all_categories_button")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={{
                pathname: "/items",
                query: { categoryId: category.id },
              }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 flex flex-col items-center justify-center transition-all hover:shadow-md hover:scale-105 cursor-pointer"
            >
              {category.imageUrl && (
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={80}
                  height={80}
                  className="rounded-full mb-3 object-cover"
                />
              )}
              <span className="text-green-800 dark:text-green-200 font-medium text-center">
                {category.name}
              </span>
              {/* <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {category.count}25 {category.count === 1 ? "item" : "items"}
              </span> */}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
