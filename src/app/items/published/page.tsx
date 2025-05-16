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
import { Badge } from "@/src/components/ui/badge";
import { Pencil, Trash2, Eye, AlertCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/src/components/ui/alert-dialog";
import { toast } from "@/src/hooks/use-toast";

interface Item {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "available" | "taken";
  category: string;
  condition: string;
  location: string;
  createdAt: string;
  views: number;
}

export default function ItemsPublishedPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real application, you would fetch the user's published items from an API
    const fetchItems = async () => {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const mockItems: Item[] = [
        {
          id: "1",
          title: "Vintage Bicycle",
          description: "A well-maintained vintage bicycle from the 1980s.",
          image: "/placeholder.svg?height=200&width=200&text=Vintage+Bicycle",
          status: "available",
          category: "Sports & Outdoors",
          condition: "Good",
          location: "Brooklyn, NY",
          createdAt: "2023-11-15T12:00:00Z",
          views: 245,
        },
        {
          id: "2",
          title: "Wooden Bookshelf",
          description:
            "Sturdy wooden bookshelf, perfect for your home library.",
          image: "/placeholder.svg?height=200&width=200&text=Wooden+Bookshelf",
          status: "taken",
          category: "Furniture",
          condition: "Like New",
          location: "Los Angeles, CA",
          createdAt: "2023-12-05T15:30:00Z",
          views: 189,
        },
        {
          id: "3",
          title: "Potted Plants",
          description:
            "Assortment of healthy potted plants, great for beginners.",
          image: "/placeholder.svg?height=200&width=200&text=Potted+Plants",
          status: "available",
          category: "Home & Garden",
          condition: "Good",
          location: "Seattle, WA",
          createdAt: "2024-01-20T09:15:00Z",
          views: 127,
        },
      ];

      setItems(mockItems);
      setIsLoading(false);
    };

    fetchItems();
  }, []);

  const handleDeleteItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
    toast({
      title: "Item deleted",
      description: "Your item has been successfully removed.",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Listed Items</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage the items you've listed for others to claim
          </p>
        </div>
        <Button asChild className="bg-green-600 hover:bg-green-700">
          <Link href="/create-product/new">List a New Item</Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-4"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No items listed yet</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            You haven't listed any items for others to claim.
          </p>
          <Button asChild className="bg-green-600 hover:bg-green-700">
            <Link href="/create-product/new">List Your First Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription>
                      Listed on {formatDate(item.createdAt)}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      item.status === "available" ? "default" : "secondary"
                    }
                    className={
                      item.status === "available"
                        ? "bg-green-500"
                        : "bg-gray-500"
                    }
                  >
                    {item.status === "available" ? "Available" : "Claimed"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative h-48 mb-4">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="outline">{item.category}</Badge>
                  <Badge variant="outline">{item.condition}</Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  {item.location}
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Eye className="h-4 w-4 mr-1" />
                  {item.views} views
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/product/${item.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/create-product/${item.id}`}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit
                    </Link>
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete your listing for "
                          {item.title}". This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteItem(item.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
