"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ItemResponse } from "@/src/lib/generated-api";
import { Clock, MapPin, MapPinHouse, Truck } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { getTimeAgo } from "@/src/utils/date-utils";

interface DetailedItemCardProps {
  item: ItemResponse;
}

export interface ConditionDetail {
  key: string;
  placeholder: string;
  color: string;
}

export const conditionDetails = [
  { key: ItemResponse.condition.NEW, placeholder: "New", color: "emerald" },
  {
    key: ItemResponse.condition.LIKE_NEW,
    placeholder: "Like New",
    color: "blue",
  },
  { key: ItemResponse.condition.USED, placeholder: "Used", color: "amber" },
  {
    key: ItemResponse.condition.DEFECTIVE,
    placeholder: "Defective",
    color: "red",
  },
];

export default function DetailedItemCard({ item }: DetailedItemCardProps) {
  const conditionDetail = conditionDetails.find(
    (condition) => condition.key == item.condition
  );

  const getConditionStyles = (color: string) => {
    const styles = {
      emerald: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
      blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
      amber: "bg-amber-500 text-white shadow-lg shadow-amber-500/25",
      red: "bg-red-500 text-white shadow-lg shadow-red-500/25",
      gray: "bg-gray-500 text-white shadow-lg shadow-gray-500/25",
    };
    return styles[color as keyof typeof styles] || styles.gray;
  };

  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-900 flex flex-col">
      <Link href={`/items/${item.id}`} className="block h-full flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-gray-800 flex-shrink-0">
          {item.imageUrls?.[0] && (
            <Image
              src={item.imageUrls[0]}
              alt={item.title || "Item image"}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          )}

          <div className="absolute top-2 left-2 z-10">
            <div
              className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm border border-white/30 ${getConditionStyles(
                conditionDetail?.color || "gray"
              )}`}
            >
              {conditionDetail?.placeholder || "Unknown"}
            </div>
          </div>

          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:bg-black/90">
              <Clock className="w-3 h-3 mr-1.5" />
              {getTimeAgo(item.createdAt)}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3 flex-1 flex flex-col">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-1">
              {item.title}
            </CardTitle>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed min-h-[2.5rem]">
              {item.description}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center min-w-0 flex-1">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">
                  {item.address?.split(",").slice(-2).join(",").trim() ||
                    item.address}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs">
              {item.pickupPossible && (
                <div className="flex items-center px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                  <MapPinHouse className="w-4 h-4 mr-1.5" />
                  Pickup
                </div>
              )}
              {item.shippingPossible && (
                <div className="flex items-center px-2 py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                  <Truck className="w-4 h-4 mr-1.5" />
                  Shipping
                </div>
              )}
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export function DetailedItemCardSkeleton() {
  return (
    <Card className="overflow-hidden border-0 shadow-sm bg-white dark:bg-gray-900">
      <Skeleton className="aspect-[4/3] w-full" />
      <div className="p-4 space-y-3">
        <div>
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-8 w-full rounded" />
      </div>
    </Card>
  );
}
