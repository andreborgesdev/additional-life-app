"use client";

import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { ItemResponse } from "@/src/lib/generated-api";
import { getTimeAgo } from "@/src/utils/date-utils";
import { getConditionDetails } from "./detailed-item-card";
import { useTranslation } from "react-i18next";

interface SimpleItemCardProps {
  item: ItemResponse;
}

export default function SimpleItemCard({ item }: SimpleItemCardProps) {
  const { t } = useTranslation("common");
  return (
    <Card className="overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-900">
      <Link href={`/items/${item.id}`} className="block">
        <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
          {item.imageUrls?.[0] && (
            <Image
              src={item.imageUrls[0]}
              alt={item.title || t("forms.item_image")}
              fill
              className="object-contain transition-transform duration-500 group-hover:scale-110"
            />
          )}

          <div className="absolute top-2 left-2 z-10">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm border border-white/30 bg-emerald-500 text-white shadow-lg shadow-emerald-500/25`}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-white mr-1.5 animate-pulse"></div>
              {t("item_details.new_badge")}
            </div>
          </div>

          <div className="absolute top-2 right-2 z-10">
            <div className="flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-black/80 text-white backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:bg-black/90">
              <Clock className="w-3 h-3 mr-1" />
              {getTimeAgo(item.createdAt)}
            </div>
          </div>
        </div>

        <CardContent className="p-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 mb-2">
            {item.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="w-3.5 h-3.5 mr-1 flex-shrink-0" />
            <span className="truncate">
              {item.address?.split(",").slice(-2).join(",").trim() ||
                item.address}
            </span>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
