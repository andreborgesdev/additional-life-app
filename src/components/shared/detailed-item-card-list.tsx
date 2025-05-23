import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ItemResponse } from "@/src/lib/generated-api";
import { MapPin, Tag, Clock, MapPinHouse, Truck } from "lucide-react";
import { getTimeAgo } from "@/src/utils/date-utils";
import { conditionDetails } from "./detailed-item-card";

interface DetailedItemCardListProps {
  item: ItemResponse;
}

export default function DetailedItemCardList({
  item,
}: DetailedItemCardListProps) {
  const conditionDetail = conditionDetails.find(
    (condition) => condition.key === item.condition
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
    <Link href={`/items/${item.id}`} className="block group">
      <Card className="overflow-hidden group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 border-0 shadow-sm bg-white dark:bg-gray-900">
        <div className="flex min-h-full">
          <div className="w-1/3 sm:w-1/4 relative">
            <div className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-800">
              {item.imageUrls?.[0] && (
                <Image
                  src={item.imageUrls[0]}
                  alt={item.title || "Item image"}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-110"
                />
              )}

              <div className="absolute top-1 left-1 z-10">
                <div
                  className={`inline-flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm border border-white/30 ${getConditionStyles(
                    conditionDetail?.color || "gray"
                  )}`}
                >
                  <span className="hidden sm:inline">
                    {conditionDetail?.placeholder || "Unknown"}
                  </span>
                  <span className="sm:hidden text-[10px]">
                    {(conditionDetail?.placeholder || "Unknown").slice(0, 3)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-2/3 sm:w-3/4 p-2 sm:p-3 flex flex-col space-y-1.5 sm:space-y-2">
            <div className="flex justify-between items-start">
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-green-600 transition-colors">
                {item.title}
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-xs">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <Tag className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                <span className="truncate text-xs">{item.category?.name}</span>
              </div>

              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1 sm:mr-1.5 flex-shrink-0" />
                <span className="truncate text-xs">
                  {item.address?.split(",").slice(-2).join(",").trim() ||
                    item.address}
                </span>
              </div>

              <div className="flex items-center gap-1 sm:gap-1.5 col-span-2">
                {item.isPickupPossible && (
                  <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                    <MapPinHouse className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="text-[10px] sm:text-xs">Pickup</span>
                  </div>
                )}
                {item.isShippingPossible && (
                  <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 font-medium">
                    <Truck className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                    <span className="text-[10px] sm:text-xs">Shipping</span>
                  </div>
                )}
                <div className="flex items-center px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400 font-medium ml-auto">
                  <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 sm:mr-1" />
                  <span className="text-[10px] sm:text-xs">
                    {getTimeAgo(item.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
