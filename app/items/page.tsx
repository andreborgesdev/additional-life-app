"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useItems } from "@/hooks/use-api";

// interface Item {
//   id: string;
//   title: string;
//   description: string;
//   category: string;
//   condition: string;
//   location: string;
//   image: string;
// }

const categories = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
];

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

export default function ItemsPage() {
  // const [items, setItems] = useState<Item[]>([]);
  // const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const { items, loading, error, fetchItems } = useItems();
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"title" | "category">("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    fetchItems(page);
  }, [page]);

  // useEffect(() => {
  //   // In a real application, you would fetch items from an API
  //   const mockItems: Item[] = [
  //     {
  //       id: "1",
  //       title: "Vintage Bicycle",
  //       description: "A well-maintained vintage bicycle from the 1980s.",
  //       category: "Sports & Outdoors",
  //       condition: "Good",
  //       location: "New York, NY",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //     {
  //       id: "2",
  //       title: "Wooden Bookshelf",
  //       description: "Sturdy wooden bookshelf, perfect for your home library.",
  //       category: "Furniture",
  //       condition: "Like New",
  //       location: "Los Angeles, CA",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //     {
  //       id: "3",
  //       title: "Potted Plants",
  //       description:
  //         "Assortment of healthy potted plants, great for beginners.",
  //       category: "Home & Garden",
  //       condition: "New",
  //       location: "Chicago, IL",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //     {
  //       id: "4",
  //       title: "Vintage Camera",
  //       description: "A classic film camera from the 1970s.",
  //       category: "Electronics",
  //       condition: "Fair",
  //       location: "Seattle, WA",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //     {
  //       id: "5",
  //       title: "Acoustic Guitar",
  //       description: "Gently used acoustic guitar, perfect for beginners.",
  //       category: "Sports & Outdoors",
  //       condition: "Good",
  //       location: "Austin, TX",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //     {
  //       id: "6",
  //       title: "Cooking Pots Set",
  //       description: "Set of high-quality cooking pots and pans.",
  //       category: "Home & Garden",
  //       condition: "Like New",
  //       location: "Boston, MA",
  //       image: "/placeholder.svg?height=200&width=200",
  //     },
  //   ];
  //   setItems(mockItems);
  //   setFilteredItems(mockItems);
  // }, []);

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>Error: {error.message}</div>;

  // useEffect(() => {
  //   let result = items;

  //   // Apply search filter
  //   if (searchTerm) {
  //     result = result.filter(
  //       (item) =>
  //         item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //         item.description.toLowerCase().includes(searchTerm.toLowerCase())
  //     );
  //   }

  //   // Apply category filter
  //   if (selectedCategory) {
  //     result = result.filter((item) => item.category === selectedCategory);
  //   }

  //   // Apply condition filter
  //   if (selectedConditions.length > 0) {
  //     result = result.filter((item) =>
  //       selectedConditions.includes(item.condition)
  //     );
  //   }

  //   // Apply sorting
  //   result.sort((a, b) => {
  //     if (a[sortBy] < b[sortBy]) return sortOrder === "asc" ? -1 : 1;
  //     if (a[sortBy] > b[sortBy]) return sortOrder === "asc" ? 1 : -1;
  //     return 0;
  //   });

  //   setFilteredItems(result);
  // }, [
  //   items,
  //   searchTerm,
  //   selectedCategory,
  //   selectedConditions,
  //   sortBy,
  //   sortOrder,
  // ]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Items</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="space-y-4">
          <div>
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              onValueChange={(value) => setSelectedCategory(value)}
              value={selectedCategory || undefined}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Condition</Label>
            <div className="space-y-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center">
                  <Checkbox
                    id={condition}
                    checked={selectedConditions.includes(condition)}
                    onCheckedChange={(checked) => {
                      setSelectedConditions(
                        checked
                          ? [...selectedConditions, condition]
                          : selectedConditions.filter((c) => c !== condition)
                      );
                    }}
                  />
                  <label
                    htmlFor={condition}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-end mb-4 space-x-4">
            <Select
              onValueChange={(value) =>
                setSortBy(value as "title" | "category")
              }
              value={sortBy}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
            <Select
              onValueChange={(value) => setSortOrder(value as "asc" | "desc")}
              value={sortOrder}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items?.content.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm">
                    <strong>Category:</strong> {item.category.name}
                  </p>
                  <p className="text-sm">
                    <strong>Condition:</strong> {item.conditionDescription}
                  </p>
                  <p className="text-sm">
                    <strong>Location:</strong> {item.address}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/product/${item.id}`}>View Details</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
