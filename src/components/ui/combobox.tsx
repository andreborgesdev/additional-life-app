"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

interface ComboboxItem {
  value: string;
  label: string;
}

interface ComboboxProps {
  items: ComboboxItem[];
  value: string; // This is the actual selected value (e.g., an ID)
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
}

const VALUE_SEPARATOR = ":::";

export function Combobox({
  items,
  value,
  onValueChange,
  placeholder = "Select an item...",
  disabled = false,
  searchPlaceholder = "Search item...",
  emptyPlaceholder = "No item found.",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedItemLabel = React.useMemo(() => {
    if (!value) return null;
    const selectedItem = items.find((item) => item.value === value);
    return selectedItem?.label;
  }, [items, value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          {selectedItemLabel ?? placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command
          filter={(itemValueFromCommand, searchString) => {
            const labelPart =
              itemValueFromCommand.split(VALUE_SEPARATOR)[1] ?? "";
            if (labelPart.toLowerCase().includes(searchString.toLowerCase())) {
              return 1;
            }
            return 0;
          }}
        >
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => {
                const combinedValue = `${item.value}${VALUE_SEPARATOR}${item.label}`;
                return (
                  <CommandItem
                    key={item.value}
                    value={combinedValue}
                    onSelect={(currentCombinedValue) => {
                      const selectedActualValue =
                        currentCombinedValue.split(VALUE_SEPARATOR)[0];
                      onValueChange(
                        selectedActualValue === value ? "" : selectedActualValue
                      );
                      setOpen(false);
                    }}
                  >
                    {item.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === item.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
