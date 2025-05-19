"use client";

import Image from "next/image";
import Link from "next/link";
import { SortBy, useItems } from "@/src/hooks/items/use-items";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import SimpleItemCard from "@/src/components/shared/simple-item-card";
import { Skeleton } from "@/src/components/ui/skeleton";

function SimpleItemCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transition-all hover:shadow-md">
      <Skeleton className="w-full h-40" /> {/* Image placeholder */}
      <div className="p-3">
        <Skeleton className="h-5 w-3/4 mb-1" /> {/* Title placeholder */}
        <Skeleton className="h-3 w-1/2 mb-2" /> {/* Category placeholder */}
        <Skeleton className="h-3 w-1/3" /> {/* Location placeholder */}
      </div>
    </div>
  );
}

function RecentListingsSkeleton() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <Skeleton className="h-8 w-1/4" /> {/* Title placeholder */}
        <Skeleton className="h-8 w-32" /> {/* View All button placeholder */}
      </div>
      <Skeleton className="h-4 w-3/4 mb-6" /> {/* Subtitle placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <SimpleItemCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}

export default function RecentListings() {
  const { data, isLoading, error } = useItems({
    page: 0,
    size: 5,
    sortBy: SortBy.CREATED_AT,
    direction: "desc",
  });

  if (isLoading) {
    return <RecentListingsSkeleton />;
  }

  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          Recent Listings
        </h2>
        <p className="text-red-500 text-center">
          Could not load recent listings.
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          Recent Listings
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
        Browse the latest free items that have been added to our platform.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {data?.content?.map((item) => (
          <SimpleItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}
