import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Separator } from "@/src/components/ui/separator";
import React from "react";

interface FiltersSheetProps {
  activeFilterCount: number;
  categories: string[];
  conditions: string[];
  selectedCategory: string | null;
  setSelectedCategory: (value: string | null) => void;
  selectedConditions: string[];
  setSelectedConditions: (value: string[]) => void;
  selectedLocation: string | null;
  setSelectedLocation: (value: string | null) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  clearFilters: () => void;
}

export default function FiltersSheet({
  activeFilterCount,
  categories,
  conditions,
  selectedCategory,
  setSelectedCategory,
  selectedConditions,
  setSelectedConditions,
  selectedLocation,
  setSelectedLocation,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  clearFilters,
}: FiltersSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <SlidersHorizontal className="h-4 w-4" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Filters & Sort</SheetTitle>
          <SheetDescription>Refine your search results</SheetDescription>
        </SheetHeader>
        <div className="space-y-6 py-4">
          <div>
            <Label htmlFor="mobile-category">Category</Label>
            <Select
              onValueChange={(value) =>
                setSelectedCategory(value === "all" ? null : value)
              }
              value={selectedCategory || "all"}
            >
              <SelectTrigger id="mobile-category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {(categories || []).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Condition</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center">
                  <Checkbox
                    id={`mobile-${condition}`}
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
                    htmlFor={`mobile-${condition}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <Label htmlFor="mobile-sortBy">Sort By</Label>
            <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
              <SelectTrigger id="mobile-sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Date Posted</SelectItem>
                <SelectItem value="title">Title</SelectItem>
                <SelectItem value="category">Category</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="mobile-sortOrder">Order</Label>
            <Select
              onValueChange={(value) => setSortOrder(value)}
              value={sortOrder}
            >
              <SelectTrigger id="mobile-sortOrder">
                <SelectValue placeholder="Order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Newest First</SelectItem>
                <SelectItem value="asc">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {activeFilterCount > 0 && (
            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          )}
        </div>
        <SheetClose asChild>
          <Button className="w-full mt-4">Apply Filters</Button>
        </SheetClose>
      </SheetContent>
    </Sheet>
  );
}
