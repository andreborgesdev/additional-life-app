"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/src/components/ui/popover";
import { Button } from "@/src/components/ui/button";
import { ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { CategoryResponse } from "@/src/lib/generated-api";
import { cn } from "@/src/lib/utils";

interface CategorySelectorProps {
  allCategories: CategoryResponse[];
  isLoadingAllCategories: boolean;
  initialCategoryId?: string | null;
  onCategorySelected: (categoryId: string) => void;
  className?: string;
}

export function CategorySelector({
  allCategories,
  isLoadingAllCategories,
  initialCategoryId,
  onCategorySelected,
  className,
}: CategorySelectorProps) {
  const [currentParentCategory, setCurrentParentCategory] =
    useState<CategoryResponse | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    initialCategoryId || null
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleCategoryClick = (category: CategoryResponse) => {
    const hasChildren = allCategories.some(
      (cat) => cat.parentId === category.id
    );
    if (hasChildren) {
      setCurrentParentCategory(category);
    } else {
      setSelectedCategoryId(category.id);
      onCategorySelected(category.id);
      setIsOpen(false);
    }
  };

  const handleBackClick = () => {
    setCurrentParentCategory(null);
  };

  const renderCategories = (categories: CategoryResponse[]) => (
    <ul className="space-y-2 max-h-80 overflow-y-auto">
      {categories.map((category) => (
        <li
          key={category.id}
          className="flex justify-between items-center p-2 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          onClick={() => handleCategoryClick(category)}
        >
          <span className="mr-12">{category.name}</span>
          {allCategories.some((cat) => cat.parentId === category.id) && (
            <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          )}
        </li>
      ))}
    </ul>
  );

  const parentCategories = allCategories.filter((cat) => cat.parentId === null);
  const childCategories = currentParentCategory
    ? allCategories.filter((cat) => cat.parentId === currentParentCategory.id)
    : [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left",
            className,
            selectedCategoryId
              ? "text-gray-900 dark:text-gray-100"
              : "text-muted-foreground"
          )}
        >
          {selectedCategoryId
            ? allCategories.find((cat) => cat.id === selectedCategoryId)
                ?.name || "Select Category"
            : "Select Category"}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-4" align="start">
        {isLoadingAllCategories ? (
          <p className="text-gray-500 dark:text-gray-400">
            Loading categories...
          </p>
        ) : currentParentCategory ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="mb-4 flex items-center gap-2"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {renderCategories(childCategories)}
          </>
        ) : (
          renderCategories(parentCategories)
        )}
      </PopoverContent>
    </Popover>
  );
}
