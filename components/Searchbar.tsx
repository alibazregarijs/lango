"use client";
import React, { useState, useMemo, startTransition, useEffect } from "react";
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
import { useQuery, useMutation } from "convex/react";
import { type WordObject } from "@/types";
import { Id } from "@/convex/_generated/dataModel";

export type selectedWordProps = {
  _id: Id<"words">;
  _creationTime: number;
  definition?: {
    definition: string;
    example: string;
  }[];
  type?: {
    partOfSpeech: string;
  }[];
  audioWordUrl?: {
    audio: string;
  }[];
  userId: string;
  word: string;
  meaningCount: number;
};

export type selectedWord = selectedWordProps[] | undefined;

const Searchbar = () => {
  const [selectedWordName, setSelectedWordName] = useState<string | null>(null);
  const [searchDisplay, setSearchDisplay] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<selectedWord>([]);

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

  const handleSuggestionClick = (word: string) => {
    setSearchDisplay(word);
    setSelectedWordName(word);
  };

  useEffect(() => {
    if (selectedWordData) {
      setSelectedWord(selectedWordData);
    }
  }, [selectedWordData]);

  return (
    <div className="mt-4">
      <Command className="rounded-lg border shadow-md">
        <CommandInput
          placeholder="Type a command or search..."
          value={searchDisplay}
          onValueChange={setSearchDisplay}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
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
    </div>
  );
};

export default Searchbar;
