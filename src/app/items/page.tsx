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
import { ArrowLeft, Check, ChevronDown } from "lucide-react";
import { CategoryResponse } from "@/src/lib/generated-api";
// import FiltersSheet from "@/src/components/filters-sheet"; // This was commented out
import DetailedItemCard from "@/src/components/detailed-item-card";
import CategoryFilter from "@/src/components/category-filter";

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
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortByOptions>(SortByOptions.RELEVANCE);
  const { t, i18n, ready } = useTranslation("common");

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

  const { data, isLoading, error } = useItems({
    sortBy: selectedSortOptionDetails?.sortBy,
    direction: selectedSortOptionDetails?.direction,
    categoryId: selectedCategoryId,
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

  const handleCategoryListItemClick = (category: CategoryResponse) => {
    setSelectedCategoryId(category.id);
    setCategoryNavPath([...categoryNavPath, category]);
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

  const getCategoryDisplayText = () => {
    if (categoryNavPath.length === 0) {
      return "All categories";
    }
    return categoryNavPath.map((c) => c.name).join(" > ");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("items.allItems")}</h1>
      {/* <FiltersSheet /> */}
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
          <CategoryFilter
            categoryFilterRef={categoryFilterRef}
            isCategoryDropdownOpen={isCategoryDropdownOpen}
            setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
            getCategoryDisplayText={getCategoryDisplayText}
            handleCategoryBreadcrumbClick={handleCategoryBreadcrumbClick}
            categoryNavPath={categoryNavPath}
            isLoadingDisplayedCategories={isLoadingDisplayedCategories}
            currentCategoriesToDisplay={currentCategoriesToDisplay}
            handleCategoryListItemClick={handleCategoryListItemClick}
            selectedCategoryId={selectedCategoryId}
            isLoadingItems={isLoading}
            totalElements={data?.totalElements}
          />
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.content?.map((item) => (
              <DetailedItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
