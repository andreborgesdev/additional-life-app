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
import { CategoryResponse } from "@/src/lib/generated-api";
import CategoryFilter from "./category-filter";
import { ConditionDetail } from "../shared/detailed-item-card";
import { SortOption } from "@/src/app/items/page";

interface FiltersSheetProps {
  activeFilterCount: number;
  allCategories: CategoryResponse[];
  selectedCategoryId: string | null;
  onApplyCategoryFilter: (category: CategoryResponse | null) => void;
  isLoadingAllCategories: boolean;
  conditions: ConditionDetail[];
  selectedConditions: string[];
  setSelectedConditions: (value: string[]) => void;
  sortByOptions: SortOption[];
  currentSortByValue: string;
  setSortBy: (value: string) => void;
  itemsType: "all" | "internal" | "external";
  setItemsType: (value: "all" | "internal" | "external") => void;
  clearFilters: () => void;
}

export default function FiltersSheet({
  activeFilterCount,
  allCategories,
  selectedCategoryId,
  onApplyCategoryFilter,
  isLoadingAllCategories,
  conditions,
  selectedConditions,
  setSelectedConditions,
  sortByOptions,
  currentSortByValue,
  setSortBy,
  itemsType,
  setItemsType,
  clearFilters,
}: FiltersSheetProps) {
  const itemTypeOptions: {
    value: "all" | "internal" | "external";
    label: string;
  }[] = [
    { value: "all", label: "All Types" },
    { value: "internal", label: "Internal" },
    { value: "external", label: "External" },
  ];

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
          <div className="flex-col gap-2">
            <Label htmlFor="mobile-category">Category</Label>
            <div className="mt-2">
              <CategoryFilter
                categories={allCategories}
                isLoadingAllCategories={isLoadingAllCategories}
                onApplyFilter={onApplyCategoryFilter}
                selectedCategoryId={selectedCategoryId}
                buttonClassName="w-full justify-start"
                popoverAlign="start"
              />
            </div>
          </div>

          <div>
            <Label>Condition</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {conditions.map((condition) => (
                <div key={condition.key} className="flex items-center">
                  <Checkbox
                    id={`mobile-${condition.key}`}
                    checked={selectedConditions.includes(condition.key)}
                    onCheckedChange={(checked) => {
                      setSelectedConditions(
                        checked
                          ? [...selectedConditions, condition.key]
                          : selectedConditions.filter(
                              (c) => c !== condition.key
                            )
                      );
                    }}
                  />
                  <label
                    htmlFor={`mobile-${condition.key}`}
                    className="ml-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition.placeholder}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* <div>
            <Label htmlFor="mobile-itemType">Item Type</Label>
            <Select
              onValueChange={(value) =>
                setItemsType(value as "all" | "internal" | "external")
              }
              value={itemsType}
            >
              <SelectTrigger id="mobile-itemType">
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                {itemTypeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div> */}

          {/* <Separator /> */}

          <div>
            <Label htmlFor="mobile-sortBy">Sort By</Label>
            <Select
              onValueChange={(value) => setSortBy(value)}
              value={currentSortByValue}
            >
              <SelectTrigger id="mobile-sortBy">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortByOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
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
