"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";

interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "available" | "taken";
}

export default function ItemsPublishedPage() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the user's published items from an API
    const mockItems: Item[] = [
      {
        id: "1",
        title: "Vintage Bicycle",
        description: "A well-maintained vintage bicycle from the 1980s.",
        image: "/placeholder.svg?height=200&width=200",
        status: "available",
      },
      {
        id: "2",
        title: "Wooden Bookshelf",
        description: "Sturdy wooden bookshelf, perfect for your home library.",
        image: "/placeholder.svg?height=200&width=200",
        status: "taken",
      },
      {
        id: "3",
        title: "Potted Plants",
        description:
          "Assortment of healthy potted plants, great for beginners.",
        image: "/placeholder.svg?height=200&width=200",
        status: "available",
      },
    ];
    setItems(mockItems);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Items Published</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>Status: {item.status}</CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                className="w-full h-48 object-cover mb-4 rounded-md"
              />
              <p>{item.description}</p>
            </CardContent>
            <CardFooter>
              <Button asChild>
                <Link href={`/items/${item.id}`}>View Details</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
