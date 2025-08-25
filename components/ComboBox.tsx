"use client";

import React, { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const actions = [
  {
    value: "delete",
    label: "Delete",
  },
  {
    value: "edit",
    label: "Edit",
  },
];

export const Combobox = ({
  message,
  messageId,
  onActionSelect,
}: {
  message: string;
  messageId: string;
  onActionSelect?: (value: string, messageId: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const handleSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
    onActionSelect?.(currentValue, messageId);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between cursor-pointer border-none bg-transparent! shadow-none"
        >
          {
            
         message}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {actions.map((action) => (
                <CommandItem
                  key={action.value}
                  className={`${
                    action.value === "delete"
                      ? "text-white bg-red-500 hover:bg-red-500!"
                      : "bg-accent"
                  }`}
                  value={action.value}
                  onSelect={handleSelect}
                >
                  {action.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = "Combobox";
