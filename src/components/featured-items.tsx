"use client";

import Image from "next/image";
import Link from "next/link";
import { useItems } from "../hooks/use-items";
import { LoadingSpinner } from "./ui/loading-spinner";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import DetailedItemCard from "./detailed-item-card";

export default function FeaturedItems() {
  const { data, isLoading, error } = useItems({
    page: 0,
    size: 3,
    sortBy: "postedOn",
    direction: "asc",
  });

  if (isLoading) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-green-700 dark:text-green-300 mb-4">
          Featured Items
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
          Featured Items
        </h2>
        <p className="text-red-500 text-center">
          Could not load featured items.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          Featured Items
        </h2>
        <Button
          asChild
          variant="ghost"
          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          <Link href="/items">
            View All Items
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground dark:text-gray-300 mb-6">
        Discover these popular free items available in the community.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.content?.map((item) => (
          <DetailedItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
