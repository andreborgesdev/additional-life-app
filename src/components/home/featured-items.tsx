"use client";

import Link from "next/link";
import { SortBy, useItems, QueryDirection } from "../../hooks/items/use-items";
import { Button } from "@/src/components/ui/button";
import { ArrowRight } from "lucide-react";
import DetailedItemCard, {
  DetailedItemCardSkeleton,
} from "../shared/detailed-item-card";
import { Skeleton } from "@/src/components/ui/skeleton";
import { useTranslation } from "react-i18next";

export default function FeaturedItems() {
  const { t } = useTranslation("common");
  const { data, isLoading, error } = useItems({
    page: 0,
    size: 3,
    sortBy: SortBy.CREATED_AT,
    direction: QueryDirection.ASC,
  });

  if (isLoading) {
    return <FeaturedItemsSkeleton />;
  }
  if (error) {
    return (
      <section className="mb-12">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          {t("home.featured_items")}
        </h2>
        <p className="text-red-500 text-center">
          {t("home.could_not_load_featured_items")}
        </p>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-3xl font-bold text-green-800 dark:text-green-100">
          {t("home.featured_items")}
        </h2>
        <Button
          asChild
          variant="ghost"
          className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
        >
          <Link href="/items">
            {t("items.view_all_items")}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <p className="text-muted-foreground dark:text-gray-300 mb-6">
        {t("home.featured_items_description")}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {data?.content?.map((item) => (
          <DetailedItemCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function FeaturedItemsSkeleton() {
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-1">
        <Skeleton className="h-8 w-1/4" /> {/* Title placeholder */}
        <Skeleton className="h-8 w-32" /> {/* View All button placeholder */}
      </div>
      <Skeleton className="h-4 w-3/4 mb-6" /> {/* Subtitle placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <DetailedItemCardSkeleton key={index} />
        ))}
      </div>
    </section>
  );
}
