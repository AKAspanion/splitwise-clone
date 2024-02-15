"use client";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandEmpty,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@radix-ui/react-dropdown-menu";
import { EXPENSE_CATEGORY_TYPES } from "@/constants/ui";

type CategoryComboboxProps = {
  label?: string;
  value: string;
  open?: boolean;
  disabled?: boolean;
  setOpen?: (open: boolean) => void;
  setValue: (value: string) => void;
};

export function CategoryCombobox(props: CategoryComboboxProps) {
  const { label, value, open, disabled, setOpen, setValue } = props;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div>
        {label ? (
          <Label className="mb-1 text-sm font-semi-bold text-neutral-700 dark:text-neutral-50">
            {label}
          </Label>
        ) : null}
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled}
            aria-expanded={open}
            className="w-full justify-between capitalize"
          >
            {value || "Select Category..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="p-0" side="bottom" align="end">
        <Command>
          <CommandEmpty>No Category found.</CommandEmpty>
          <CommandGroup>
            {EXPENSE_CATEGORY_TYPES.map((c) => (
              <CommandItem
                key={c}
                value={c}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? "" : currentValue);
                  setOpen && setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === c.toLowerCase() ? "opacity-100" : "opacity-0",
                  )}
                />
                <div className="truncate w-full">{c}</div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
