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
} from "lucide-react";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import { useFeaturedCategories } from "../hooks/use-categories";

// Map slugs to icons - ensure this covers all expected root category slugs
const iconMap: { [key: string]: React.ElementType } = {
  furniture: Sofa,
  clothing: Shirt,
  books: Book,
  electronics: Tv,
  "home-and-garden": Leaf,
  "sports-and-outdoors": Dumbbell,
  "kitchen-and-dining": Utensils,
  "office-supplies": Briefcase,
  "art-and-crafts": Palette,
  "toys-and-games": Coffee, // Assuming Coffee icon is for Toys & Games
  automotive: Truck,
  miscellaneous: Recycle, // Default/fallback icon
};

export default function Categories() {
  const { data: categories, isLoading, error } = useFeaturedCategories();

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
          Categories
        </h2>
        <div className="flex justify-center items-center h-32">
          <LoadingSpinner className="h-8 w-8 text-green-600" />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
          Categories
        </h2>
        <p className="text-red-500 text-center">Could not load categories.</p>
      </section>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
          Categories
        </h2>
        <p className="text-gray-500 dark:text-gray-400 text-center">
          No categories found.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
        Categories
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category) => {
          const IconComponent = iconMap[category.slug] || Recycle; // Fallback to Recycle if no icon is mapped
          return (
            <Link
              key={category.id} // Use category.id as key
              href={`/categories/${category.slug}`}
              className="bg-white dark:bg-green-800 rounded-lg shadow-md p-4 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              <IconComponent
                size={32}
                className="text-green-600 dark:text-green-400 mb-2"
              />
              <span className="text-green-800 dark:text-green-200 font-medium text-center">
                {category.name}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="mt-6 text-center">
        <Link
          href="/categories"
          className="inline-block px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
        >
          View All Categories
        </Link>
      </div>
    </section>
  );
}
