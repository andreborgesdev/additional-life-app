import React from "react";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import { LoadingSpinner } from "@/src/components/ui/loading-spinner";
import { CategoryResponse } from "@/src/lib/generated-api";
import { ArrowLeft, Check, ChevronDown } from "lucide-react";

interface CategoryFilter {
  categoryFilterRef: React.RefObject<HTMLDivElement>;
  isCategoryDropdownOpen: boolean;
  setIsCategoryDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCategoryBreadcrumbClick: (index: number) => void;
  categoryNavPath: CategoryResponse[];
  isLoadingDisplayedCategories: boolean;
  currentCategoriesToDisplay: CategoryResponse[];
  handleCategoryListItemClick: (category: CategoryResponse) => void;
  selectedCategoryId: string | null;
  isLoadingItems: boolean; // Renamed from isLoading to avoid conflict if this component fetches data later
  totalElements: number | undefined;
}

const CategoryFilter: React.FC<CategoryFilter> = ({
  categoryFilterRef,
  isCategoryDropdownOpen,
  setIsCategoryDropdownOpen,
  handleCategoryBreadcrumbClick,
  categoryNavPath,
  isLoadingDisplayedCategories,
  currentCategoriesToDisplay,
  handleCategoryListItemClick,
  selectedCategoryId,
  isLoadingItems,
  totalElements,
}) => {
  const getCategoryDisplayText = () => {
    if (categoryNavPath.length === 0) {
      return "All categories";
    }
    return categoryNavPath.map((c) => c.name).join(" > ");
  };

  return (
    <div className="relative" ref={categoryFilterRef}>
      <Label>Category</Label>
      <button
        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
        className="mt-1 w-full flex items-center justify-between text-left p-2 border rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <span className="truncate">{getCategoryDisplayText()}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            isCategoryDropdownOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isCategoryDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full border rounded-md bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => handleCategoryBreadcrumbClick(-1)}
              className={`w-full text-left text-sm p-2 rounded flex items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                categoryNavPath.length === 0
                  ? "font-semibold text-green-600 dark:text-green-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
            >
              {categoryNavPath.length > 0 && (
                <ArrowLeft size={16} className="mr-2" />
              )}
              All categories
            </button>
            {categoryNavPath.map((crumb, idx) => (
              <button
                key={crumb.id}
                onClick={() => handleCategoryBreadcrumbClick(idx)}
                className={`w-full text-left text-sm p-2 rounded flex items-center mt-1 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                  idx === categoryNavPath.length - 1
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : "text-blue-600 dark:text-blue-400"
                }`}
              >
                <ArrowLeft size={16} className="mr-2" /> {crumb.name}
              </button>
            ))}
          </div>
          <div className="p-2 max-h-60 overflow-y-auto">
            {isLoadingDisplayedCategories ? (
              <div className="flex justify-center items-center h-20">
                <LoadingSpinner className="h-5 w-5" />
              </div>
            ) : (
              <ul className="space-y-1">
                {currentCategoriesToDisplay.map((category) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryListItemClick(category)}
                      className={`w-full text-left text-sm p-2 rounded flex justify-between items-center hover:bg-gray-100 dark:hover:bg-gray-700 ${
                        selectedCategoryId === category.id
                          ? "bg-green-50 dark:bg-green-900"
                          : ""
                      }`}
                    >
                      <span className="flex items-center">
                        {selectedCategoryId === category.id && (
                          <Check
                            size={16}
                            className="mr-2 text-green-600 dark:text-green-400"
                          />
                        )}
                        {category.name}
                      </span>
                      {typeof (category as any).itemCount === "number" && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {(category as any).itemCount}
                        </span>
                      )}
                    </button>
                  </li>
                ))}
                {currentCategoriesToDisplay.length === 0 &&
                  !isLoadingDisplayedCategories &&
                  categoryNavPath.length === 0 && ( // Only show if at root and no categories
                    <li className="p-2 text-sm text-gray-500 dark:text-gray-400">
                      No categories found.
                    </li>
                  )}
              </ul>
            )}
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              className="w-full"
              disabled={isLoadingItems}
              onClick={() => setIsCategoryDropdownOpen(false)}
            >
              Show {totalElements ?? 0} results
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
