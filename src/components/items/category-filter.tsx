"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { ChevronDown, ArrowLeft, Check } from "lucide-react";
import { Skeleton } from "@/src/components/ui/skeleton";
import { CategoryResponse } from "@/src/lib/generated-api";

interface CategoryFilterProps {
  categories: CategoryResponse[];
  isLoadingAllCategories: boolean;
  onApplyFilter: (category: CategoryResponse | null) => void;
  selectedCategoryId: string | null;
}

export default function CategoryFilter({
  categories,
  isLoadingAllCategories,
  onApplyFilter,
  selectedCategoryId,
}: CategoryFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activePath, setActivePath] = useState<CategoryResponse[]>([]);
  const [categoriesToList, setCategoriesToList] = useState<CategoryResponse[]>(
    []
  );
  const [categoryToApply, setCategoryToApply] =
    useState<CategoryResponse | null>(null);

  const categoryMap = useMemo(() => {
    const map = new Map<string, CategoryResponse>();
    (categories || []).forEach((cat) => cat.id && map.set(cat.id, cat));
    return map;
  }, [categories]);

  const categoryChildrenMap = useMemo(() => {
    const map = new Map<string | null, CategoryResponse[]>();
    (categories || []).forEach((cat) => {
      const parentId = cat.parentId || null;
      if (!map.has(parentId)) {
        map.set(parentId, []);
      }
      map.get(parentId)!.push(cat);
    });
    map.forEach((children) =>
      children.sort((a, b) => a.name.localeCompare(b.name))
    );
    return map;
  }, [categories]);

  const getCategoryById = (id: string | null): CategoryResponse | null => {
    if (!id) return null;
    return categoryMap.get(id) || null;
  };

  const getChildren = (parentId: string | null): CategoryResponse[] => {
    return categoryChildrenMap.get(parentId || null) || [];
  };

  const getAncestors = (catId: string | null): CategoryResponse[] => {
    const path: CategoryResponse[] = [];
    let current = getCategoryById(catId);
    while (current) {
      path.unshift(current);
      current = getCategoryById(current.parentId || null);
    }
    return path;
  };

  const showResultsButtonText = useMemo(() => {
    if (categoryToApply && typeof categoryToApply.count === "number") {
      return `Show ${categoryToApply.count} Results`;
    }
    return `Show All Results`;
  }, [categoryToApply]);

  const currentContextTitle = useMemo(() => {
    if (activePath.length > 0) {
      return activePath[activePath.length - 1].name;
    }
    return "All Categories";
  }, [activePath]);

  useEffect(() => {
    if (isOpen) {
      let initialPath: CategoryResponse[] = [];
      let initialCategoriesToList: CategoryResponse[] = [];
      let initialCategoryToApply: CategoryResponse | null = null;

      if (selectedCategoryId) {
        const fullPathToSelected = getAncestors(selectedCategoryId);
        if (fullPathToSelected.length > 0) {
          initialCategoryToApply =
            fullPathToSelected[fullPathToSelected.length - 1];
          if (fullPathToSelected.length > 1) {
            initialPath = fullPathToSelected.slice(0, -1);
            const parentOfSelected = initialPath[initialPath.length - 1];
            initialCategoriesToList = getChildren(parentOfSelected.id);
          } else {
            initialPath = [];
            initialCategoriesToList = getChildren(null);
          }
        } else {
          initialPath = [];
          initialCategoriesToList = getChildren(null);
          initialCategoryToApply = null;
        }
      } else {
        initialPath = [];
        initialCategoriesToList = getChildren(null);
        initialCategoryToApply = null;
      }
      setActivePath(initialPath);
      setCategoriesToList(initialCategoriesToList);
      setCategoryToApply(initialCategoryToApply);
    }
  }, [isOpen, selectedCategoryId, categories]);

  const handleCategoryClick = (category: CategoryResponse) => {
    setCategoryToApply(category);
    const children = getChildren(category.id);
    if (children.length > 0) {
      setActivePath([...activePath, category]);
      setCategoriesToList(children);
    }
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = activePath.slice(0, index + 1);
    setActivePath(newPath);
    const currentCategory = newPath[newPath.length - 1];
    setCategoryToApply(currentCategory);
    setCategoriesToList(getChildren(currentCategory.id));
  };

  const handleBackToAllCategoriesClick = () => {
    setActivePath([]);
    setCategoriesToList(getChildren(null));
    setCategoryToApply(null);
  };

  const handleApplyCurrentSelection = () => {
    onApplyFilter(categoryToApply);
    setIsOpen(false);
  };

  const triggerButtonLabel = useMemo(() => {
    if (isLoadingAllCategories && !(categories && categories.length > 0))
      return "Loading...";
    if (selectedCategoryId) {
      const cat = getCategoryById(selectedCategoryId);
      return cat ? cat.name : "All Categories";
    }
    return "All Categories";
  }, [selectedCategoryId, categories, isLoadingAllCategories, getCategoryById]);

  if (isLoadingAllCategories && !(categories && categories.length > 0)) {
    return <Skeleton className="h-10 w-[200px]" />;
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full md:w-[200px] justify-between"
          disabled={
            isLoadingAllCategories && !(categories && categories.length > 0)
          }
        >
          <span className="truncate">{triggerButtonLabel}</span>
          <ChevronDown className="ml-2 h-4 w-4 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0" align="start">
        <div className="p-4 border-b">
          {activePath.length > 0 && (
            <button
              onClick={handleBackToAllCategoriesClick}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-2 w-full text-left"
            >
              <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
              All Categories
            </button>
          )}
          {activePath.slice(0, -1).map((cat, index) => (
            <button
              key={cat.id}
              onClick={() => handleBreadcrumbClick(index)}
              className="flex items-center text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-2 w-full text-left"
            >
              <ArrowLeft className="mr-2 h-4 w-4 flex-shrink-0" />
              {cat.name}
            </button>
          ))}
          <div className="font-semibold text-lg mt-1 truncate">
            {currentContextTitle}
          </div>
        </div>

        <div className="max-h-[300px] overflow-y-auto">
          {categoriesToList.length === 0 && activePath.length > 0 && (
            <p className="p-4 text-sm text-gray-500 dark:text-gray-400">
              No subcategories.
            </p>
          )}
          {categoriesToList.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category)}
              className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                categoryToApply?.id === category.id
                  ? "bg-gray-100 dark:bg-gray-700 font-medium"
                  : ""
              }`}
            >
              <span className="truncate">{category.name}</span>
              <div className="flex items-center flex-shrink-0">
                {selectedCategoryId === category.id && (
                  <Check className="h-4 w-4 text-green-600 mr-2" />
                )}
                {typeof category.count === "number" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {category.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t">
          <Button
            onClick={handleApplyCurrentSelection}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white"
          >
            {showResultsButtonText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
