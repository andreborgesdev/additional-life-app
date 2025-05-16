import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { CategoryResponse } from "@/src/lib/generated-api";
import { ChevronDown, ChevronRight, Home, Loader2 } from "lucide-react";
import { ScrollArea } from "@/src/components/ui/scroll-area";

// Moved from use-category-navigation.ts
export interface DisplayCategory extends CategoryResponse {
  hasSubcategories: boolean;
}

// Moved from use-category-navigation.ts
const findDirectSubcategories = (
  parentId: number | null,
  allCats: CategoryResponse[] | undefined
): CategoryResponse[] => {
  if (!allCats) return [];
  return allCats.filter((cat) => cat.parentId === parentId);
};

// Moved from use-category-navigation.ts
const buildCategoryPath = (
  leafCatIdStr: string | null,
  allCats: CategoryResponse[] | undefined
): CategoryResponse[] => {
  if (!leafCatIdStr || !allCats || allCats.length === 0) return [];
  const path: CategoryResponse[] = [];
  let currentIdNum: number | null = parseInt(leafCatIdStr, 10);

  while (currentIdNum !== null && !isNaN(currentIdNum)) {
    const currentCat = allCats.find((c) => c.id === currentIdNum);
    if (currentCat) {
      path.unshift(currentCat);
      currentIdNum = currentCat.parentId ?? null;
    } else {
      break;
    }
  }
  return path;
};

interface CategorySelectorProps {
  allCategories: CategoryResponse[] | undefined;
  isLoadingAllCategories: boolean;
  initialCategoryId?: string | null;
  onCategorySelected: (categoryId: string | null) => void;
  closeOnSelect?: boolean;
}

export function CategorySelector({
  allCategories,
  isLoadingAllCategories,
  initialCategoryId,
  onCategorySelected,
  closeOnSelect = true,
}: CategorySelectorProps) {
  const internalWrapperRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // State and logic from useCategoryNavigation hook
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId || null
  );
  const [categoryNavPath, setCategoryNavPath] = useState<CategoryResponse[]>(
    []
  );
  const [currentCategoriesToDisplay, setCurrentCategoriesToDisplay] = useState<
    DisplayCategory[]
  >([]);

  useEffect(() => {
    if (initialCategoryId && allCategories && allCategories.length > 0) {
      setSelectedCategoryId(initialCategoryId);
      const newNavPath = buildCategoryPath(initialCategoryId, allCategories);
      setCategoryNavPath(newNavPath);
    } else if (!initialCategoryId) {
      setSelectedCategoryId(null);
      setCategoryNavPath([]);
    }
  }, [initialCategoryId, allCategories]);

  useEffect(() => {
    if (isLoadingAllCategories || !allCategories) {
      setCurrentCategoriesToDisplay([]);
      return;
    }

    let parentIdToDisplayChildren: number | null = null;
    if (categoryNavPath.length > 0) {
      const lastNavCrumb = categoryNavPath[categoryNavPath.length - 1];
      parentIdToDisplayChildren =
        typeof lastNavCrumb.id === "number" ? lastNavCrumb.id : null;
    }

    const subcategories = findDirectSubcategories(
      parentIdToDisplayChildren,
      allCategories
    );

    const displayCategories: DisplayCategory[] = subcategories.map((cat) => ({
      ...cat,
      hasSubcategories:
        findDirectSubcategories(cat.id ?? null, allCategories).length > 0,
    }));

    setCurrentCategoriesToDisplay(displayCategories);
  }, [categoryNavPath, allCategories, isLoadingAllCategories]);

  const handleCategoryBreadcrumbClick = useCallback(
    (categoryId: string | null) => {
      if (categoryId === null) {
        setCategoryNavPath([]);
        setSelectedCategoryId(null);
      } else {
        const newNavPath = buildCategoryPath(categoryId, allCategories);
        setCategoryNavPath(newNavPath);
        if (newNavPath.length > 0) {
          const newSelectedId = newNavPath[newNavPath.length - 1].id;
          setSelectedCategoryId(
            newSelectedId !== undefined ? newSelectedId.toString() : null
          );
        } else {
          setSelectedCategoryId(null);
        }
      }
    },
    [allCategories]
  );

  const handleCategoryListItemClick = useCallback(
    (category: CategoryResponse) => {
      if (category.id === undefined) return;

      const categoryIdStr = category.id.toString();
      setSelectedCategoryId(categoryIdStr);

      const children = findDirectSubcategories(category.id, allCategories);

      if (children.length > 0) {
        const newNavPath = buildCategoryPath(categoryIdStr, allCategories);
        setCategoryNavPath(newNavPath);
      } else {
        const newNavPath = buildCategoryPath(categoryIdStr, allCategories);
        setCategoryNavPath(newNavPath);
        // Dropdown closing logic is handled by onCategoryItemClick and useEffect below
      }
    },
    [allCategories]
  );
  // End of moved hook logic

  useEffect(() => {
    onCategorySelected(selectedCategoryId);
  }, [selectedCategoryId, onCategorySelected]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        internalWrapperRef.current &&
        !internalWrapperRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  const onCategoryItemClick = (category: DisplayCategory) => {
    handleCategoryListItemClick(category);
    if (closeOnSelect && !category.hasSubcategories) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (closeOnSelect && selectedCategoryId) {
      // Check if the selected category is a leaf node in the current display context
      const selectedCatInDisplay = currentCategoriesToDisplay.find(
        (c) => c.id?.toString() === selectedCategoryId
      );
      if (selectedCatInDisplay && !selectedCatInDisplay.hasSubcategories) {
        setIsDropdownOpen(false);
      } else if (categoryNavPath.length > 0) {
        // If selected category is the last in nav path and has no subcategories (globally)
        const lastNavCat = categoryNavPath[categoryNavPath.length - 1];
        if (lastNavCat?.id?.toString() === selectedCategoryId) {
          const subcategoriesOfLastNavCat = findDirectSubcategories(
            lastNavCat.id ?? null,
            allCategories
          );
          if (subcategoriesOfLastNavCat.length === 0) {
            setIsDropdownOpen(false);
          }
        }
      }
    }
  }, [
    selectedCategoryId,
    closeOnSelect,
    currentCategoriesToDisplay,
    categoryNavPath,
    allCategories, // Added allCategories as findDirectSubcategories needs it
  ]);

  const getCategoryDisplayText = () => {
    if (categoryNavPath.length === 0) {
      return "Select a category";
    }
    return categoryNavPath.map((c) => c.name).join(" > ");
  };

  return (
    <div className="relative w-full" ref={internalWrapperRef}>
      <Button
        variant="outline"
        className="w-full justify-between items-center bg-white dark:bg-gray-950"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-expanded={isDropdownOpen}
        aria-haspopup="listbox"
        aria-controls="category-list"
        type="button"
      >
        <span className="truncate">
          {selectedCategoryId && categoryNavPath.length > 0
            ? categoryNavPath
                .map((cat) => cat.name)
                .join(" > ")
                .substring(0, 50) +
              (categoryNavPath.map((cat) => cat.name).join(" > ").length > 50
                ? "..."
                : "")
            : "Select a category"}
        </span>
        <ChevronDown
          className={`ml-2 h-4 w-4 transition-transform ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        />
      </Button>
      {isDropdownOpen && (
        <div
          id="category-list"
          className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-lg max-h-96 flex flex-col"
          role="listbox"
        >
          <div className="p-2 flex flex-col flex-grow min-h-0 overflow-hidden">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2 border-b border-gray-200 dark:border-gray-700 pb-2 flex-shrink-0">
              <button
                onClick={() => handleCategoryBreadcrumbClick(null)}
                className="hover:underline flex items-center"
                aria-label="Go to root categories"
                type="button"
              >
                <Home className="h-4 w-4 mr-1" /> All Categories
              </button>
              {categoryNavPath.map((category, index) => (
                <div key={category.id} className="flex items-center">
                  <ChevronRight className="h-4 w-4 mx-1 text-gray-400 dark:text-gray-500" />
                  <button
                    onClick={() =>
                      handleCategoryBreadcrumbClick(category.id!.toString())
                    }
                    className={`hover:underline ${
                      index === categoryNavPath.length - 1
                        ? "font-semibold text-green-600 dark:text-green-400"
                        : ""
                    }`}
                    aria-current={
                      index === categoryNavPath.length - 1 ? "page" : undefined
                    }
                    type="button"
                  >
                    {category.name}
                  </button>
                </div>
              ))}
            </div>
            {isLoadingAllCategories &&
            currentCategoriesToDisplay.length === 0 ? (
              <div className="flex flex-grow items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-green-600 dark:text-green-400" />
                <span className="ml-2">Loading categories...</span>
              </div>
            ) : currentCategoriesToDisplay.length > 0 ? (
              <ScrollArea className="flex-grow min-h-0">
                <ul>
                  {currentCategoriesToDisplay.map((category) => (
                    <li key={category.id}>
                      <button
                        onClick={() => onCategoryItemClick(category)}
                        className={`w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md flex justify-between items-center ${
                          selectedCategoryId === category.id?.toString()
                            ? "font-semibold text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/50"
                            : "text-gray-800 dark:text-gray-200"
                        }`}
                        role="option"
                        aria-selected={
                          selectedCategoryId === category.id?.toString()
                        }
                        type="button"
                      >
                        {category.name}
                        {category.hasSubcategories && (
                          <ChevronRight className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            ) : (
              <div className="flex flex-grow flex-col items-center justify-center p-4 text-center text-gray-500 dark:text-gray-400">
                No subcategories found.
                {categoryNavPath.length > 0 && (
                  <div className="mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleCategoryBreadcrumbClick(
                          categoryNavPath.length > 1
                            ? categoryNavPath[
                                categoryNavPath.length - 2
                              ].id!.toString()
                            : null
                        )
                      }
                      type="button"
                    >
                      Go back
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
