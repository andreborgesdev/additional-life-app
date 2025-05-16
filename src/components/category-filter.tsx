import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { CategoryResponse } from "@/src/lib/generated-api";
import { ChevronDown } from "lucide-react";
import {
  CategorySelector,
  buildCategoryPath,
} from "@/src/components/items/category-selector";

interface CategoryFilterProps {
  allCategories: CategoryResponse[] | undefined;
  isLoadingAllCategories: boolean;
  onApplyFilter: (category: CategoryResponse | null) => void;
  selectedCategoryId: string | null;
  isLoadingItems: boolean;
  totalElements: number | undefined;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  allCategories,
  isLoadingAllCategories,
  onApplyFilter,
  selectedCategoryId,
  isLoadingItems,
  totalElements,
}) => {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryFilterRef = useRef<HTMLDivElement>(null);
  const [pendingSelectedCategoryId, setPendingSelectedCategoryId] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (isCategoryDropdownOpen) {
      setPendingSelectedCategoryId(selectedCategoryId);
    }
  }, [isCategoryDropdownOpen, selectedCategoryId]);

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

  const handleCategorySelectorChange = (newlySelectedId: string | null) => {
    setPendingSelectedCategoryId(newlySelectedId);
  };

  const applyCategorySelection = () => {
    if (!allCategories && pendingSelectedCategoryId !== null) {
      onApplyFilter(null);
      setIsCategoryDropdownOpen(false);
      return;
    }

    const categoryToApply =
      pendingSelectedCategoryId && allCategories
        ? allCategories.find(
            (cat) => cat.id?.toString() === pendingSelectedCategoryId
          )
        : null;

    onApplyFilter(categoryToApply || null);
    setIsCategoryDropdownOpen(false);
  };

  const getActiveFilterDisplayText = () => {
    if (!selectedCategoryId || !allCategories || allCategories.length === 0) {
      return "All categories";
    }
    const path = buildCategoryPath(selectedCategoryId, allCategories);
    if (path.length > 0) {
      return path.map((c) => c.name).join(" > ");
    }
    const selectedCat = allCategories.find(
      (c) => c.id?.toString() === selectedCategoryId
    );
    return selectedCat?.name || "Selected Category";
  };

  return (
    <div
      ref={categoryFilterRef}
      className="relative w-full md:w-auto md:min-w-[200px]"
    >
      <button
        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
        className="mt-1 w-full flex items-center justify-between text-left p-2 border rounded-md bg-white dark:bg-gray-800 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        <span className="truncate">{getActiveFilterDisplayText()}</span>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            isCategoryDropdownOpen ? "transform rotate-180" : ""
          }`}
        />
      </button>

      {isCategoryDropdownOpen && (
        <div className="absolute z-10 mt-1 w-full border rounded-md bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-2">
            <CategorySelector
              allCategories={allCategories}
              isLoadingAllCategories={isLoadingAllCategories}
              initialCategoryId={pendingSelectedCategoryId}
              onCategorySelected={handleCategorySelectorChange}
              closeOnSelect={false}
            />
          </div>
          <div className="p-2 border-t border-gray-200 dark:border-gray-700">
            <Button
              className="w-full"
              disabled={isLoadingItems || isLoadingAllCategories}
              onClick={applyCategorySelection}
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
