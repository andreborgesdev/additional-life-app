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
import { useCategories, useRootCategories } from "@/src/hooks/use-categories";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";

// Map slugs to icons
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
  "toys-and-games": Coffee, // Assuming Coffee icon is for Toys & Games as per original
  automotive: Truck,
  miscellaneous: Recycle,
};

const categories = [
  { name: "Furniture", icon: Sofa, slug: "furniture" },
  { name: "Clothing", icon: Shirt, slug: "clothing" },
  { name: "Books", icon: Book, slug: "books" },
  { name: "Electronics", icon: Tv, slug: "electronics" },
  { name: "Home & Garden", icon: Leaf, slug: "home-and-garden" },
  { name: "Sports & Outdoors", icon: Dumbbell, slug: "sports-and-outdoors" },
  { name: "Kitchen & Dining", icon: Utensils, slug: "kitchen-and-dining" },
  { name: "Office Supplies", icon: Briefcase, slug: "office-supplies" },
  { name: "Art & Crafts", icon: Palette, slug: "art-and-crafts" },
  { name: "Toys & Games", icon: Coffee, slug: "toys-and-games" },
  { name: "Automotive", icon: Truck, slug: "automotive" },
  { name: "Miscellaneous", icon: Recycle, slug: "miscellaneous" },
];

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
          console.log("Category:", category);
          // Ensure category and category.slug are defined before trying to access iconMap
          // const IconComponent =
          //   category && category.slug
          //     ? iconMap[category.slug] || Recycle
          //     : Recycle;
          return (
            <Link
              key={category.id || category.slug} // Use category.id if available, otherwise slug
              href={`/categories/${category.slug}`}
              className="bg-white dark:bg-green-800 rounded-lg shadow-md p-6 flex flex-col items-center justify-center transition-transform hover:scale-105 cursor-pointer"
            >
              {/* <IconComponent
                size={48}
                className="text-green-600 dark:text-green-400 mb-4"
              /> */}
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
