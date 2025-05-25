"use client";

import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { AlertCircle } from "lucide-react";
import { useUserItems } from "@/src/hooks/items/use-user-items";
import { ItemResponse } from "@/src/lib/generated-api";
import { PublishedItemCard } from "@/src/components/items/published-item-card";
import { useTranslation } from "react-i18next";

export default function ItemsPublishedPage() {
  const { t } = useTranslation("common");
  const { data: items, isLoading, error, refetch } = useUserItems();

  const orderedItems = items
    ?.filter((item) => item.active)
    .sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return dateB.getTime() - dateA.getTime();
    });

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2 text-red-700">
          {t("items.error_loading_items")}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {error.message || t("errors.unexpected_error")}
        </p>
        <Button onClick={() => refetch()}>{t("items.try_again")}</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {t("items.my_listed_items")}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t("items.manage_listed_items_description")}
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/items/create/new">{t("items.list_new_item")}</Link>
        </Button>
      </div>

      {isLoading ? (
        <ItemsPublishedSkeleton />
      ) : !items || items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {t("items.no_items_listed_title")}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t("items.no_items_listed_description")}
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/items/create/new">{t("items.list_first_item")}</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orderedItems?.map((item) => (
            <PublishedItemCard key={item.id} item={item} onRefetch={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}

function ItemsPublishedSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
          <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}
