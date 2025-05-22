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
  disabled?: boolean;
}

export function CategorySelector({
  allCategories,
  isLoadingAllCategories,
  initialCategoryId,
  onCategorySelected,
  className,
  disabled,
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
      {[...categories]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((category) => {
          const hasChildren = allCategories.some(
            (cat) => cat.parentId === category.id
          );
          return (
            <li
              key={category.id}
              className={cn(
                "flex justify-between items-center p-2 rounded-lg cursor-pointer",
                hasChildren
                  ? "hover:bg-gray-50 dark:hover:bg-gray-700" // More subtle hover for navigational items
                  : "hover:bg-gray-100 dark:hover:bg-gray-800" // Standard hover for selectable items
              )}
              onClick={() => handleCategoryClick(category)}
            >
              <span
                className={cn(
                  "mr-12",
                  hasChildren
                    ? "text-gray-600 dark:text-gray-400" // Dimmed text for navigational items
                    : "text-gray-900 dark:text-gray-100" // Standard text for selectable items
                )}
              >
                {category.name}
              </span>
              {hasChildren && (
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              )}
            </li>
          );
        })}
    </ul>
  );

  const parentCategories = allCategories
    .filter((cat) => cat.parentId === null)
    .sort((a, b) => a.name.localeCompare(b.name));
  const childCategories = currentParentCategory
    ? allCategories
        .filter((cat) => cat.parentId === currentParentCategory.id)
        .sort((a, b) => a.name.localeCompare(b.name))
    : [];

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
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
      <PopoverContent
        className="p-4 w-[var(--radix-popover-trigger-width)]"
        align="start"
      >
        {isLoadingAllCategories ? (
          <p className="text-gray-500 dark:text-gray-400">
            Loading categories...
          </p>
        ) : currentParentCategory ? (
          <>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center justify-start  gap-2 w-full"
              onClick={handleBackClick}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="px-2 py-2 font-bold border-b">
              <h3>{currentParentCategory.name}</h3>
            </div>
            {renderCategories(childCategories)}
          </>
        ) : (
          renderCategories(parentCategories)
        )}
      </PopoverContent>
    </Popover>
  );
}
