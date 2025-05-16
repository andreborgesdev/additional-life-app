import Link from "next/link";
import { Card } from "@/src/components/ui/card";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { ItemResponse } from "@/src/lib/generated-api";
import { MapPin, Tag } from "lucide-react";
import { getTimeAgo } from "./detailed-item-card";

interface DetailedItemCardListProps {
  item: ItemResponse;
}

export default function DetailedItemCardList({
  item,
}: DetailedItemCardListProps) {
  return (
    <Card
      key={item.id}
      className="overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
    >
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 relative group">
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

          <Link href={`/items/${item.id}`} className="block">
            <Image
              src={item.imageUrl || "/placeholder.svg"}
              alt={item.title || "Placeholder"}
              width={400}
              height={300}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </Link>
        </div>
        <div className="md:w-3/4 p-4 flex flex-col">
          <div className="flex justify-between items-start">
            <Link href={`/items/${item.id}`} className="block">
              <h3 className="text-xl font-semibold mb-2 hover:text-green-600 transition-colors">
                {item.title}
              </h3>
            </Link>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {getTimeAgo(item.postedOn)}
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4 flex-grow">
            {item.description}
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
              <span className="inline-block w-4 h-4 rounded-full bg-green-500 mr-2"></span>
              <div>
                <p className="text-sm font-medium">Condition</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {item.condition}
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
          <div className="flex justify-end">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={`/items/${item.id}`}>View Details</Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
