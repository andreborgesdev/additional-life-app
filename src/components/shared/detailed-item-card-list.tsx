import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ItemResponse } from "@/src/lib/generated-api";
import { MapPin, Tag } from "lucide-react";
import { getTimeAgo } from "@/src/utils/date-utils";
import { conditionDetails } from "./detailed-item-card";

interface DetailedItemCardListProps {
  item: ItemResponse;
}

export default function DetailedItemCardList({
  item,
}: DetailedItemCardListProps) {
  const currentCondition = conditionDetails.find(
    (condition) => condition.key === item.condition
  );

  return (
    <Link href={`/items/${item.id}`} className="block group">
      <Card
        key={item.id}
        className="overflow-hidden group-hover:shadow-lg transition-shadow duration-300 relative"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/4 relative">
            {/* Favorite Button */}
            {/* <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 bg-white/80 dark:bg-black/50 hover:bg-white dark:hover:bg-black rounded-full"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(item.id);
                    }}
                  >
                    <Heart
                      className={`h-5 w-5 ${
                        favoriteItems.includes(item.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-500"
                      }`}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {favoriteItems.includes(item.id)
                    ? "Remove from favorites"
                    : "Add to favorites"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider> */}

            {/* Item Badges */}
            {/* <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {item.isNew && (
                <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
              )}
              {item.isFeatured && (
                <Badge className="bg-amber-500 hover:bg-amber-600">
                  <Star className="h-3 w-3 mr-1 fill-white" /> Featured
                </Badge>
              )}
            </div> */}

            <div className="aspect-w-4 aspect-h-3">
              <Image
                src={item.imageUrls[0]}
                alt={item.title || "Placeholder"}
                width={400}
                height={300}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          </div>
          <div className="md:w-3/4 p-4 flex flex-col">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-semibold mb-2 group-hover:text-green-600 transition-colors">
                {item.title}
              </h3>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {getTimeAgo(item.createdAt)}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow text-sm">
              {item.description && item.description.length > 150
                ? `${item.description.substring(0, 150)}...`
                : item.description}
            </p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.category?.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`inline-block w-3 h-3 rounded-full bg-${
                    currentCondition?.color || "gray"
                  }-500 mr-1.5`}
                ></span>
                <div>
                  <p className="text-sm font-medium">Condition</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {currentCondition?.placeholder || "Unknown"}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <div>
                  <p className="text-sm font-medium">Location</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.address}
                  </p>
                </div>
              </div>
            </div>
            {/* The "View Details" button is removed as the whole card is clickable */}
          </div>
        </div>
      </Card>
    </Link>
  );
}
