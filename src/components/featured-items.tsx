"use client";

import Image from "next/image";
import Link from "next/link";
import { useItems } from "../hooks/use-items";
import { LoadingSpinner } from "./ui/loading-spinner";

export default function FeaturedItems() {
  const { data, isLoading, error } = useItems({
    page: 0,
    size: 3,
    sortBy: "postedOn",
    direction: "asc",
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <p>Loading product...</p>
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  if (error) return <p>Error loading featured items: {error.message}</p>;

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
        Featured Items
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.content?.map((item) => (
          <Link key={item.id} href={`/items/${item.id}`} className="block">
            <div className="bg-white dark:bg-green-800 rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
              <Image
                src={item.imageUrl || "/placeholder.svg"}
                alt={item.title || "Placeholder"}
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
    </section>
  );
}
