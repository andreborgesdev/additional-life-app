"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { QueryDirection, SortBy, useItems } from "@/src/hooks/items/use-items";
import { useTranslation } from "react-i18next";
import { useCategories } from "@/src/hooks/use-categories";
import {
  ChevronDown,
  LayoutGrid,
  MapPin,
  Search,
  X,
  ListIcon,
} from "lucide-react";
import { CategoryResponse, ItemResponse } from "@/src/lib/generated-api";
import DetailedItemCard, {
  conditionDetails,
  DetailedItemCardSkeleton,
} from "@/src/components/shared/detailed-item-card";
import { motion } from "framer-motion";
import { useToast } from "@/src/hooks/use-toast";
import { Skeleton } from "@/src/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { Badge } from "@/src/components/ui/badge";
import FiltersSheet from "@/src/components/items/filters-sheet";
import DetailedItemCardList from "@/src/components/shared/detailed-item-card-list";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import CategoryFilter from "@/src/components/items/category-filter";

enum SortByOptions {
  RELEVANCE,
  TITLE_ASC,
  TITLE_DESC,
  CREATED_AT_ASC,
  CREATED_AT_DESC,
}

const sortByOptions = [
  {
    value: SortByOptions.RELEVANCE,
    label: "Relevance",
    sortBy: SortBy.CREATED_AT,
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
    value: SortByOptions.CREATED_AT_ASC,
    label: "Newly Posted",
    sortBy: SortBy.CREATED_AT,
    direction: QueryDirection.DESC,
  },
  {
    value: SortByOptions.CREATED_AT_DESC,
    label: "Oldest",
    sortBy: SortBy.CREATED_AT,
    direction: QueryDirection.ASC,
  },
];

export default function ItemsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const initialQuery = searchParams.get("q") || "";

  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.RELEVANCE);
  const { t } = useTranslation("common");
  const [viewMode, setViewMode] = useState<"grid" | "row">("grid");
  const [activeFilterTags, setActiveFilterTags] = useState<
    { id: string; label: string; type: string }[]
  >([]);
  const { toast } = useToast();

  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [itemsType, setItemsType] = useState<"all" | "internal" | "external">(
    "all"
  );

  const selectedSortOptionDetails = sortByOptions.find(
    (option) => option.value === sortBy
  );

  const {
    data: items,
    isLoading: isLoadingItems,
    error,
  } = useItems({
    page,
    size: 10,
    sortBy: selectedSortOptionDetails?.sortBy || SortBy.POSTED_ON,
    direction: selectedSortOptionDetails?.direction || QueryDirection.DESC,
    query: searchQuery || undefined,
    category: selectedCategoryId || undefined,
    condition:
      selectedConditions.length > 0 ? selectedConditions.join(",") : undefined,
    itemType: itemsType === "all" ? undefined : itemsType,
  });

  const { data: allCategoriesData, isLoading: isLoadingAllCategories } =
    useCategories();

  useEffect(() => {
    const newTags: { id: string; label: string; type: string }[] = [];
    if (selectedCategoryId && allCategoriesData && allCategoriesData.length > 0) {
      const categoryMap = new Map<string, CategoryResponse>();
      allCategoriesData.forEach((cat) => {
        if (cat.id) {
          categoryMap.set(cat.id, cat);
        }
      });

      const getCategoryById = (id: string | null): CategoryResponse | null => {
        if (!id) return null;
        return categoryMap.get(id) || null;
      };

      const pathArray: CategoryResponse[] = [];
      let current = getCategoryById(selectedCategoryId);
      while (current) {
        pathArray.unshift(current);
        current = getCategoryById(current.parentId || null);
      }

      let categoryLabel = `ID: ${selectedCategoryId}`;
      if (pathArray.length > 0) {
        categoryLabel = pathArray.map((c) => c.name).join(" > ");
      } else {
        const selectedCat = categoryMap.get(selectedCategoryId);
        if (selectedCat && selectedCat.name) {
          categoryLabel = selectedCat.name;
        } else {
          categoryLabel = "Selected Category";
        }
      }
      newTags.push({
        id: `category-${selectedCategoryId}`,
        label: `Category: ${categoryLabel}`,
        type: "category",
      });
    }
    selectedConditions.forEach((condition) => {
      newTags.push({
        id: `condition-${condition}`,
        label: `Condition: ${
          conditionDetails.find((c) => c.key === condition)?.placeholder
        }`,
        type: "condition",
      });
    });
    if (itemsType !== "all") {
      newTags.push({
        id: `type-${itemsType}`,
        label: `Type: ${
          itemsType.charAt(0).toUpperCase() + itemsType.slice(1)
        }`,
        type: "itemsType",
      });
    }
    setActiveFilterTags(newTags);
  }, [selectedCategoryId, selectedConditions, itemsType, allCategoriesData]);

  if (isLoadingItems && !items) {
    return <ItemsPageSkeleton />;
  }

  if (error) return <p>Error loading items: {error.message}</p>;

  const finalItemsToDisplay = items?.content || [];

  const getActiveFilterCount = () => {
    let count = 0;
    if (selectedCategoryId) count++;
    count += selectedConditions.length;
    if (itemsType !== "all") count++;
    return count;
  };
  const activeFilterCount = getActiveFilterCount();

  const clearFilters = () => {
    setSearchTerm("");
    setSearchQuery("");
    setSelectedCategoryId(null);
    setSelectedConditions([]);
    setSortBy(SortByOptions.RELEVANCE);
    setItemsType("all");
    setPage(0);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.delete("q");
    router.push(pathname + "?" + newSearchParams.toString());
  };

  const removeFilterTag = (tagId: string, type: string) => {
    if (type === "category") {
      setSelectedCategoryId(null);
    } else if (type === "condition") {
      const condition = tagId.replace("condition-", "");
      setSelectedConditions((prev) => prev.filter((c) => c !== condition));
    } else if (type === "itemsType") {
      setItemsType("all");
    }
    setPage(0);
  };

  const handleOnSortByChanged = (value: string) => {
    setSortBy(Number(value) as SortByOptions);
    setPage(0);
  };

  const handleApplyCategoryFilter = (category: CategoryResponse | null) => {
    setSelectedCategoryId(category ? category.id?.toString() ?? null : null);
    setPage(0);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setPage(0);

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (searchTerm) {
      newSearchParams.set("q", searchTerm);
    } else {
      newSearchParams.delete("q");
    }
    router.push(pathname + "?" + newSearchParams.toString());
  };

  // const toggleFavorite = (itemId: string) => {
  //   setFavoriteItems((prev) => {
  //     const isCurrentlyFavorite = prev.includes(itemId);
  //     if (isCurrentlyFavorite) {
  //       toast({ title: "Removed from favorites" });
  //       return prev.filter((id) => id !== itemId);
  //     } else {
  //       toast({ title: "Added to favorites" });
  //       return [...prev, itemId];
  //     }
  //   });
  // };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-200">
          {t("items.all_items")}
        </h1>

        <div className="flex items-center mt-4 md:mt-0">
          <div className="relative w-full md:w-auto">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder={t("search.placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="pl-10 w-full md:w-[250px]"
            />
          </div>
          <Button onClick={handleSearch} className="ml-2">
            <Search size={18} className="mr-2 md:hidden" />
            {t("search.search_button_text")}
          </Button>
          <FiltersSheet
            activeFilterCount={activeFilterCount}
            clearFilters={clearFilters}
            allCategories={allCategoriesData || []}
            selectedCategory={selectedCategoryId}
            setSelectedCategory={(value) => {
              const newCatId = value === "all" ? null : value;
              const categoryObject =
                newCatId && allCategoriesData
                  ? allCategoriesData.find(
                      (cat) => cat.id?.toString() === newCatId
                    )
                  : null;
              handleApplyCategoryFilter(
                categoryObject ||
                  (newCatId ? ({ id: newCatId } as CategoryResponse) : null)
              );
            }}
            conditions={conditionDetails}
            selectedConditions={selectedConditions}
            setSelectedConditions={(newConditions) => {
              setSelectedConditions(newConditions);
              setPage(0);
              // refetch(); // Removed: useItems will react
            }}
            sortByOptions={sortByOptions.map((opt) => ({
              ...opt,
              value: opt.value.toString(),
            }))} // Ensure value is string for Select
            currentSortByValue={sortBy.toString()}
            setSortBy={handleOnSortByChanged}
            // Props for itemsType if FiltersSheet handles it
            itemsType={itemsType}
            setItemsType={(newType) => {
              setItemsType(newType as "all" | "internal" | "external");
              setPage(0);
              // refetch(); // Removed: useItems will react
            }}
          />
        </div>
      </div>

      {/* Desktop Filter Bar */}
      <div className="hidden md:block mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
          <div className="flex flex-wrap gap-4 items-center">
            <CategoryFilter
              categories={allCategoriesData || []}
              isLoadingAllCategories={isLoadingAllCategories}
              onApplyFilter={handleApplyCategoryFilter}
              selectedCategoryId={selectedCategoryId}
            />
            <div>
              <Select
                onValueChange={handleOnSortByChanged}
                value={sortBy.toString()} // Ensure value is string for Select
              >
                <SelectTrigger className="w-[180px]">
                  {/* <ChevronDown className="mr-2 h-4 w-4" /> Replaced by SelectValue placeholder */}
                  <SelectValue placeholder={t("sort.sort_by")} />
                </SelectTrigger>
                <SelectContent>
                  {sortByOptions.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value.toString()}
                    >
                      {t(option.label.toLowerCase().replace(/ /g, "_"))}{" "}
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
                  aria-label={t("grid_view_aria_label")}
                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-800 dark:data-[state=on]:text-green-100"
                >
                  <LayoutGrid className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="row"
                  aria-label={t("row_view_aria_label")}
                  className="data-[state=on]:bg-green-100 data-[state=on]:text-green-800 dark:data-[state=on]:bg-green-800 dark:data-[state=on]:text-green-100"
                >
                  <ListIcon className="h-4 w-4" />{" "}
                  {/* Changed from List to ListIcon */}
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {activeFilterCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="ml-auto"
              >
                <X className="mr-2 h-4 w-4" />
                {t("filters.clear_filters_button")}
              </Button>
            )}
          </div>

          {/* Condition Filter Pills */}
          <div className="mt-4 flex flex-wrap gap-2">
            {conditionDetails.map((condition) => (
              <Badge
                key={condition.key}
                variant={
                  selectedConditions.includes(condition.key)
                    ? "default"
                    : "outline"
                }
                className={`cursor-pointer ${
                  selectedConditions.includes(condition.key)
                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => {
                  setSelectedConditions((prev) =>
                    prev.includes(condition.key)
                      ? prev.filter((c) => c !== condition.key)
                      : [...prev, condition.key]
                  );
                  setPage(0);
                  // refetch(); // Removed: useItems will react
                }}
              >
                {condition.placeholder}
                {selectedConditions.includes(condition.key) && (
                  <X className="ml-1 h-3 w-3" />
                )}
              </Badge>
            ))}
          </div>

          {/* Active Filter Tags */}
          {activeFilterTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">
                {t("filters.active_filters_label")}:
              </span>
              {activeFilterTags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="flex items-center gap-1 bg-green-50 text-green-800 dark:bg-green-900 dark:text-green-100"
                >
                  {tag.label}{" "}
                  {/* Label is already formatted with "Category:", "Condition:", etc. */}
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
          {isLoadingItems && items ? ( // Show skeleton for count if loading more items but previous data exists
            <Skeleton className="h-5 w-24" />
          ) : (
            <span>
              {t("items.items_found_count")}: {items?.totalElements || 0}
            </span>
          )}
        </span>
      </div>

      {/* Loading State for subsequent loads or filtering (when itemsData exists) */}
      {isLoadingItems && items ? (
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              : "space-y-4"
          }`}
        >
          {(items.content || Array.from({ length: items.size || 4 })).map(
            // Use existing items or skeleton placeholders
            (item, index) =>
              item && item.id ? (
                viewMode === "grid" ? (
                  <DetailedItemCardSkeleton key={item.id.toString()} />
                ) : (
                  <DetailedItemCardSkeleton key={item.id.toString()} />
                )
              ) : (
                <DetailedItemCardSkeleton key={`skeleton-${index}`} />
              )
          )}
        </div>
      ) : (
        <>
          {/* Items Display */}
          {finalItemsToDisplay.length > 0 ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {finalItemsToDisplay.map(
                  (item) =>
                    item.id !== undefined && ( // Ensure item.id is defined before rendering
                      <motion.div
                        key={item.id.toString()} // Use toString for key if id is number
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DetailedItemCard
                          item={item} // Pass the whole item object
                          isFavorite={favoriteItems.includes(
                            item.id.toString()
                          )}
                          onToggleFavorite={() =>
                            toggleFavorite(item.id.toString())
                          }
                          viewMode={viewMode}
                        />
                      </motion.div>
                    )
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {finalItemsToDisplay.map(
                  (item) =>
                    item.id !== undefined && (
                      <motion.div
                        key={item.id.toString()}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <DetailedItemCardList
                          item={item}
                          isFavorite={favoriteItems.includes(
                            item.id.toString()
                          )}
                          onToggleFavorite={() =>
                            toggleFavorite(item.id.toString())
                          }
                          viewMode={viewMode}
                        />
                      </motion.div>
                    )
                )}
              </div>
            )
          ) : (
            <>
              {/* Empty State - only show if not loading and no items */}
              {!isLoadingItems && items?.empty && (
                <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {t("items.no_items_found_title")}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                    {t("items.no_items_found_description")}
                  </p>
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="mr-2"
                  >
                    {t("filters.clear_filters_button")}
                  </Button>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      clearFilters();
                    }}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {t("items.browse_all_items_button")}
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Pagination (Example) - Implement based on itemsData.totalPages, itemsData.number */}
      {items && items.totalPages && items.totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isLoadingItems}
            variant="outline"
            className="mr-2"
          >
            {t("items.previous_page_button")}
          </Button>
          <span className="self-center text-sm">
            {t("items.page_indicator", {
              currentPage: page + 1,
              totalPages: items.totalPages,
            })}
          </span>
          <Button
            onClick={() =>
              setPage((p) => Math.min(items.totalPages - 1, p + 1))
            }
            disabled={page >= items.totalPages - 1 || isLoadingItems}
            variant="outline"
            className="ml-2"
          >
            {t("items.next_page_button")}
          </Button>
        </div>
      )}
    </div>
  );
}

function ItemsPageSkeleton() {
  // ... (Skeleton component remains largely the same as in the initial user prompt)
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
