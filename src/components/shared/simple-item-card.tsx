import Link from "next/link";
import { Card, CardContent } from "@/src/components/ui/card";
import Image from "next/image";
import { Clock, MapPin } from "lucide-react";
import { Badge } from "@/src/components/ui/badge";
import { ItemResponse } from "@/src/lib/generated-api";
import { getTimeAgo } from "@/src/utils/date-utils";

interface SimpleItemCardProps {
  item: ItemResponse;
}

export default function SimpleItemCard({ item }: SimpleItemCardProps) {
  return (
    <Card
      key={item.id}
      className="overflow-hidden group hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] dark:bg-gray-800"
    >
      <Link href={`/items/${item.id}`} className="block">
        <div className="relative">
          <Image
            src={item.imageUrls[0]}
            alt={item.title || "Placeholder"}
            width={300}
            height={200}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-600">
              <Clock className="h-3 w-3 mr-1" /> New
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-green-800 dark:text-green-200 line-clamp-1 mb-1">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              {item.address}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {getTimeAgo(item.createdAt)}
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
