"use client";
import React, { useState, startTransition, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import useDebounce from "@/hooks/useDebounce";
import { useUser } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { type selectedWordProps } from "@/types";
import { Modal } from "@/components/Modal";
import { Play } from "iconsax-reactjs";
import useSpeek from "@/hooks/useSpeek";

const Searchbar = () => {
  const [selectedWordName, setSelectedWordName] = useState<string | null>(null);
  const [searchDisplay, setSearchDisplay] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<selectedWordProps[]>([]);
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);

  const { userId } = useUser();

  const recentWordQuizzes = useQuery(api.words.getUserWordsQuery, {
    userId: userId!,
  });

  const selectedWordData = useQuery(
    api.words.getWordObjectQuery,
    selectedWordName ? { userId: userId!, word: selectedWordName } : "skip" // Convex way to skip queries if no word selected
  );

  const handleEmptySearch = (value: string) => {
    if (!value.trim()) {
      setFilteredSuggestions([]);
      return true;
    }
    return false;
  };

  const handleFilter = (value: string) => {
    startTransition(() => {
      if (handleEmptySearch(value)) return;

      const matched =
        recentWordQuizzes
          ?.filter((suggestion) =>
            suggestion.word.toLowerCase().includes(value.toLowerCase())
          )
          .map((s) => s.word) ?? [];
      setFilteredSuggestions(matched);
    });
  };

  const debouncedFilter = useDebounce({
    callback: handleFilter,
    delay: 300,
  });

  useEffect(() => {
    debouncedFilter(searchDisplay);
  }, [searchDisplay]);

  useEffect(() => {
    if (selectedWordData) {
      setSelectedWord(selectedWordData);
      setOpen(true);
    }
  }, [selectedWordData]);

  const handleSuggestionClick = (word: string) => {
    setSearchDisplay(word);
    setSelectedWordName(word);
  };

  const { speak } = useSpeek({ text: selectedWord[0]?.word });

  return (
    <div className="h-full flex justify-center items-start">
      <div className="lg:w-[90%]   w-full mt-4">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Type a command or search..."
            value={searchDisplay}
            onValueChange={setSearchDisplay}
          />
          <CommandList>
            <CommandEmpty>
              <span>{`You haven't seen any words yet.`}</span>
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
              {filteredSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>
        {selectedWord && (
          <Modal open={open} onOpenChange={setOpen}>
            <Modal.Content>
              <Modal.Section
                title="You've seen this word before."
                loading={loading}
              >
                <Modal.Body
                  label="Word"
                  className="flex justify-center items-center"
                >
                  {selectedWord[0]?.word}
                </Modal.Body>
                <Modal.Body
                  label="Definition"
                  className="flex flex-col justify-center items-center"
                >
                  {selectedWord[0]?.definition?.[0]?.definition ?? ""}
                </Modal.Body>
                <Modal.Body className="flex justify-center items-center">
                  <Play
                    className="cursor-pointer"
                    size="34"
                    color="#F97535"
                    variant="Bulk"
                    onClick={speak}
                  />
                </Modal.Body>
              </Modal.Section>
            </Modal.Content>
          </Modal>
        )}
      </div>
    </div>
  );
};

export default Searchbar;
