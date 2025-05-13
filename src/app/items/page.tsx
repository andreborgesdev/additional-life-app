"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { QueryDirection, SortBy, useItems } from "@/src/hooks/use-items";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";

const categories = [
  "Furniture",
  "Electronics",
  "Clothing",
  "Books",
  "Home & Garden",
  "Sports & Outdoors",
];

const conditions = ["New", "Like New", "Good", "Fair", "Poor"];

enum SortByOptions {
  RELEVANCE,
  TITLE_ASC,
  TITLE_DESC,
  POSTED_ON_ASC,
  POSTED_ON_DESC,
}

const sortByOptions = [
  {
    value: SortByOptions.RELEVANCE,
    label: "Relevance",
    sortBy: SortBy.POSTED_ON,
    direction: QueryDirection.DESC,
  },
  {
    value: SortByOptions.TITLE_ASC,
    label: "Title A-Z",
    sortBy: SortBy.TITLE,
    direction: QueryDirection.ASC,
  },
  {
    value: SortByOptions.TITLE_DESC,
    label: "Title Z-A",
    sortBy: SortBy.TITLE,
    direction: QueryDirection.DESC,
  },
  {
    value: SortByOptions.POSTED_ON_ASC,
    label: "Newly Posted",
    sortBy: SortBy.POSTED_ON,
    direction: QueryDirection.ASC,
  },
  {
    value: SortByOptions.POSTED_ON_DESC,
    label: "Oldest",
    sortBy: SortBy.POSTED_ON,
    direction: QueryDirection.DESC,
  },
];

export default function ItemsPage() {
  // const [items, setItems] = useState<Item[]>([]);
  // const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.RELEVANCE);

  // Find the selected sort option object to pass to useItems
  const selectedSortOptionDetails = sortByOptions.find(
    (option) => option.value === sortBy
  );

  const { data, isLoading, error } = useItems({
    sortBy: selectedSortOptionDetails?.sortBy,
    direction: selectedSortOptionDetails?.direction,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading product...</p>
        <LoadingSpinner className="h-5 w-5" />
      </div>
    );
  if (error) return <p>Error loading items: {error.message}</p>;

  const handleOnSortByChanged = (value: string) => {
    setSortBy(Number(value) as SortByOptions);
  };

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
          {/* <div>
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
          </div> */}
          {/* TODO Add condition */}
          {/* <div>
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
          </div> */}
        </div>

        <div className="md:col-span-3">
          <div className="flex justify-end mb-4 space-x-4">
            <Select
              onValueChange={handleOnSortByChanged}
              value={sortBy.toString()} // Ensure value is a string for Select
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value.toString()} // Ensure value is a string for SelectItem
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.content?.map((item) => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <img
                    src={item.imageUrl || "/placeholder.svg"}
                    alt={item.title ? item.title : "Placeholder"}
                    className="w-full h-48 object-cover mb-4 rounded-md"
                  />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {item.description}
                  </p>
                  <p className="text-sm">
                    <strong>Category:</strong> {item.category?.name}
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
                    <Link href={`/items/${item.id}`}>View Details</Link>
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
