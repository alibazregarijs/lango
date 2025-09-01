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
  {
    value: "reply",
    label: "Reply",
  },
];

export const Combobox = ({
  message,
  messageId,
  onActionSelect,
  isOwnMessage,
}: {
  message: string;
  messageId: string;
  onActionSelect?: (value: string, messageId: string) => void;
  isOwnMessage: boolean;
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
          className="justify-between cursor-pointer border-none bg-transparent! shadow-none w-full max-w-[200px] min-h-[40px] h-auto py-2"
        >
          <span className="w-full break-words whitespace-pre-wrap overflow-hidden text-left">
            {message}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 opacity-50 flex-shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {actions.map((action) => {
                let edit = action.value === "edit" && !isOwnMessage;
                if (!edit) {
                  return (
                    <CommandItem
                      key={action.value}
                      className={`${
                        action.value === "delete"
                          ? "text-white bg-red-500 hover:bg-red-600!" // Changed hover to red-600 for better UX
                          : "bg-accent hover:bg-accent/80"
                      } transition-colors`}
                      value={action.value}
                      onSelect={handleSelect}
                    >
                      {action.label}
                    </CommandItem>
                  );
                }
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

Combobox.displayName = "Combobox";
