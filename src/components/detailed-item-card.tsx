"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";
import { ItemResponse } from "../lib/generated-api";
import { Badge } from "./ui/badge";
import { Clock, Heart, MapPin, Star, Tag } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

export const getTimeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;
  if (diffDays < 60) return "1 month ago";
  return `${Math.floor(diffDays / 30)} months ago`;
};

interface DetailedItemCardProps {
  item: ItemResponse;
}

const conditionDetails = [
  { key: ItemResponse.condition.NEW, placeholder: "New", color: "green" },
  {
    key: ItemResponse.condition.LIKE_NEW,
    placeholder: "Like New",
    color: "green",
  },
  { key: ItemResponse.condition.USED, placeholder: "Used", color: "green" },
  {
    key: ItemResponse.condition.DEFECTIVE,
    placeholder: "Defective",
    color: "green",
  },
];

export default function DetailedItemCard({ item }: DetailedItemCardProps) {
  return (
    <Card
      key={item.id}
      className="overflow-hidden group hover:shadow-lg transition-shadow duration-300 relative"
    >
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
                  "text-gray-500"
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
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {/* {item.isNew && (
          <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
        )}
        {item.isFeatured && (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Star className="h-3 w-3 mr-1 fill-white" /> Featured
          </Badge>
        )} */}
      </div>

      <Link href={`/item/${item.id}`} className="block">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={item.imageUrl || "/placeholder.svg"}
            alt={item.title || "Placeholder"}
            fill
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardHeader className="pb-2">
          <CardTitle className="line-clamp-1 text-green-800 dark:text-green-200">
            {item.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
            {item.description}
          </p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            <Tag className="h-3.5 w-3.5 mr-1" />
            {item.category?.name}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
            <span
              className={`inline-block w-3 h-3 rounded-full bg-${
                conditionDetails.find(
                  (condition) => condition.key == item.condition
                )?.color || "gray"
              }-500 mr-1.5`}
            ></span>
            {conditionDetails.find(
              (condition) => condition.key == item.condition
            )?.placeholder || "Unknown"}
          </div>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            {item.address}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between items-center pt-0">
          <span className="flex items-center text-xs text-gray-500 dark:text-gray-400">
            <Clock className="h-3 w-3 mr-1" />
            {getTimeAgo(item.postedOn)}
          </span>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            View Details
          </Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
