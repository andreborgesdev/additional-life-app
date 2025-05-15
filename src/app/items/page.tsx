"use client";

import { useState, useEffect, useRef } from "react";
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
import { useTranslation } from "react-i18next";
import {
  useRootCategories,
  useSubcategories,
} from "@/src/hooks/use-categories";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  LayoutGrid,
  List,
  MapPin,
  Search,
  Tag,
  X,
} from "lucide-react";
import { CategoryResponse } from "@/src/lib/generated-api";
// import FiltersSheet from "@/src/components/filters-sheet"; // This was commented out
import DetailedItemCard, {
  DetailedItemCardSkeleton,
} from "@/src/components/detailed-item-card";
import CategoryFilter from "@/src/components/category-filter";
import FiltersSheet from "@/src/components/filters-sheet";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";

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

const locations = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
];

function ItemsPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header: Title and Search */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <Skeleton className="h-9 w-1/3 md:w-1/4 mb-4 md:mb-0" /> {/* Title */}
        <div className="flex items-center w-full md:w-auto">
          <div className="relative w-full md:w-[300px] mr-2">
            <Skeleton className="h-10 w-full" /> {/* Search Input */}
          </div>
          {/* <Skeleton className="h-10 w-10" /> FiltersSheet button placeholder */}
        </div>
      </div>

      {/* Desktop Filter Bar Skeleton */}
      <div className="hidden md:block mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <Skeleton className="h-10 w-[180px]" /> {/* Category Filter */}
            <Skeleton className="h-10 w-[180px]" /> {/* Location Select */}
            <Skeleton className="h-10 w-[180px]" /> {/* Sort By Select */}
            <Skeleton className="h-10 w-[80px]" /> {/* View Mode Toggle */}
            <Skeleton className="h-9 w-28 ml-auto" />{" "}
            {/* Clear Filters Button */}
          </div>
          {/* Condition Filter Pills Skeleton */}
          <div className="mt-4 flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-20 rounded-full" />
            ))}
          </div>
        </div>
      </div>

      {/* Results Count Skeleton */}
      <div className="flex justify-between items-center mb-4">
        <Skeleton className="h-5 w-1/4 md:w-1/6" />
      </div>

      {/* Items Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <DetailedItemCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
}

export default function ItemsPage() {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.RELEVANCE);
  const { t, i18n, ready } = useTranslation("common");
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
  const [activeFilterTags, setActiveFilterTags] = useState<
    { id: string; label: string; type: string }[]
  >([]);

  const [categoryNavPath, setCategoryNavPath] = useState<CategoryResponse[]>(
    []
  );
  const [currentCategoriesToDisplay, setCurrentCategoriesToDisplay] = useState<
    CategoryResponse[]
  >([]);
  const [isLoadingDisplayedCategories, setIsLoadingDisplayedCategories] =
    useState(false);

  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryFilterRef = useRef<HTMLDivElement>(null);

  const selectedSortOptionDetails = sortByOptions.find(
    (option) => option.value === sortBy
  );

  const {
    data: items,
    isLoading,
    error,
  } = useItems({
    sortBy: selectedSortOptionDetails?.sortBy,
    direction: selectedSortOptionDetails?.direction,
  });

  const currentParentIdForNav =
    categoryNavPath.length > 0
      ? categoryNavPath[categoryNavPath.length - 1].id
      : null;

  const { data: rootCategories, isLoading: isLoadingRoot } = useRootCategories({
    enabled: categoryNavPath.length === 0,
  });

  const { data: subcategories, isLoading: isLoadingSub } = useSubcategories(
    currentParentIdForNav!,
    {
      enabled: !!currentParentIdForNav,
    }
  );

  useEffect(() => {
    setIsLoadingDisplayedCategories(isLoadingRoot || isLoadingSub);
  }, [isLoadingRoot, isLoadingSub]);

  useEffect(() => {
    if (categoryNavPath.length === 0) {
      if (rootCategories) {
        setCurrentCategoriesToDisplay(rootCategories);
      } else if (!isLoadingRoot) {
        setCurrentCategoriesToDisplay([]);
      }
    } else {
      if (subcategories) {
        setCurrentCategoriesToDisplay(subcategories);
      } else if (!isLoadingSub) {
        setCurrentCategoriesToDisplay([]);
      }
    }
  }, [
    categoryNavPath,
    rootCategories,
    subcategories,
    isLoadingRoot,
    isLoadingSub,
  ]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        categoryFilterRef.current &&
        !categoryFilterRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

  if (isLoading && !items) {
    // Show skeleton only on initial load
    return <ItemsPageSkeleton />;
  }

  if (error) return <p>Error loading items: {error.message}</p>;

  const activeFilterCount = () => {
    let count = 0;
    if (selectedCategoryId) count++;
    count += selectedConditions.length;
    if (selectedLocation) count++;
    return count;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategoryId(null);
    setSelectedConditions([]);
    setSelectedLocation(null);
  };

  const removeFilterTag = (tagId: string, type: string) => {
    if (type === "category") {
      setSelectedCategoryId(null);
    } else if (type === "condition") {
      const condition = tagId.replace("condition-", "");
      setSelectedConditions((prev) => prev.filter((c) => c !== condition));
    } else if (type === "location") {
      setSelectedLocation(null);
    }
  };

  const handleOnSortByChanged = (value: string) => {
    setSortBy(Number(value) as SortByOptions);
  };

  const handleCategoryBreadcrumbClick = (index: number) => {
    if (index < 0) {
      setCategoryNavPath([]);
      setSelectedCategoryId(null);
    } else {
      const newPath = categoryNavPath.slice(0, index + 1);
      setCategoryNavPath(newPath);
      setSelectedCategoryId(newPath[newPath.length - 1].id);
    }
  };

  const handleCategoryListItemClick = (category: CategoryResponse) => {
    setSelectedCategoryId(category.id);
    setCategoryNavPath([...categoryNavPath, category]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200">
          All Items
        </h1>

        <div className="flex items-center mt-4 md:mt-0">
          <div className="relative w-full md:w-auto mr-2">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full md:w-[300px]"
            />
          </div>

          {/* <FiltersSheet /> */}
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4">
            <CategoryFilter
              categoryFilterRef={categoryFilterRef}
              isCategoryDropdownOpen={isCategoryDropdownOpen}
              setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
              handleCategoryBreadcrumbClick={handleCategoryBreadcrumbClick}
              categoryNavPath={categoryNavPath}
              isLoadingDisplayedCategories={isLoadingDisplayedCategories}
              currentCategoriesToDisplay={currentCategoriesToDisplay}
              handleCategoryListItemClick={handleCategoryListItemClick}
              selectedCategoryId={selectedCategoryId}
              isLoadingItems={isLoading}
              totalElements={items?.totalElements}
            />

            <div>
              <Select
                onValueChange={(value) =>
                  setSelectedLocation(value === "all" ? null : value)
                }
                value={selectedLocation || "all"}
              >
                <SelectTrigger className="w-[180px]">
                  <div className="flex items-center">
                    <MapPin className="mr-2 h-4 w-4" />
                    <span>{selectedLocation || "All Locations"}</span>
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Select
                onValueChange={handleOnSortByChanged}
                value={sortBy.toString()}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <ToggleGroup
                type="single"
                value={viewMode}
                onValueChange={(value) =>
                  value && setViewMode(value as "grid" | "row")
                }
                className="border rounded-md"
              >
                <ToggleGroupItem
                  value="grid"
                  aria-label="Grid view"
                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-800 dark:data-[state=on]:text-green-100"
                >
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="row"
                  aria-label="Row view"
                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-800 dark:data-[state=on]:text-green-100"
                >
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {activeFilterCount() > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>

          {/* Condition Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {conditions.map((condition) => (
              <Badge
                key={condition}
                variant={
                  selectedConditions.includes(condition) ? "default" : "outline"
                }
                className={`cursor-pointer ${
                  selectedConditions.includes(condition)
                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedConditions((prev) =>
                    prev.includes(condition)
                      ? prev.filter((c) => c !== condition)
                      : [...prev, condition]
                  );
                }}
              >
                {condition}
                {selectedConditions.includes(condition) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                Active filters:
              </span>
              {activeFilterTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  {tag.label}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeFilterTag(tag.id, tag.type)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex justify-between items-center mb-4">
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {isLoading ? ( // Show skeleton for count if loading more items
            <Skeleton className="h-5 w-24" />
          ) : (
            `${items?.totalElements} ${
              items?.totalElements === 1 ? "item" : "items"
            } found`
          )}
        </span>
      </div>

      {/* Loading State for subsequent loads or filtering */}
      {isLoading && items ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: items.content?.length || 4 }).map(
            (_, index) => (
              <DetailedItemCardSkeleton key={index} />
            )
          )}
        </div>
      ) : (
        <>
          {/* Items Display */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items?.content?.map((item) => (
                <DetailedItemCard key={item.id} item={item} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {items?.content?.map((item) => (
                <DetailedItemCard key={item.id} item={item} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {items?.empty && (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No items found
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                We couldn't find any items matching your current filters. Try
                adjusting your search criteria or browse all items.
              </p>
              <Button onClick={clearFilters} variant="outline" className="mr-2">
                Clear Filters
              </Button>
              <Button
                onClick={() => setSearchTerm("")}
                className="bg-green-600 hover:bg-green-700"
              >
                Browse All Items
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
