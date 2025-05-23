"use client";

import { LayoutGrid, ListIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import { useTranslation } from "react-i18next";

interface ViewModeToggleProps {
  viewMode: "grid" | "row";
  onViewModeChange: (mode: "grid" | "row") => void;
  className?: string;
}

export default function ViewModeToggle({
  viewMode,
  onViewModeChange,
  className = "",
}: ViewModeToggleProps) {
  const { t } = useTranslation("common");

  return (
    <ToggleGroup
      type="single"
      value={viewMode}
      onValueChange={(value) =>
        value && onViewModeChange(value as "grid" | "row")
      }
      className={`border rounded-md ${className}`}
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
        <ListIcon className="h-4 w-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
