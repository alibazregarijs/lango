"use client";
import React, {
  useState,
  startTransition,
  useEffect,
  useCallback,
} from "react";
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
import Image from "next/image";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { type selectedWordProps } from "@/types";
import { Modal } from "@/components/Modal";
import { Play } from "iconsax-reactjs";
import useSpeek from "@/hooks/useSpeek";
import Spinner from "@/components/Spinner";
import { handleUserFilter, handleWordFilter } from "@/utils/index";
import { useUserSelection } from "@/hooks/useHandleNotification";
import { type Suggestion } from "@/types";

const Searchbar = ({
  users = false,
  setIsModalOpen,
}: {
  users?: boolean;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedWordName, setSelectedWordName] = useState<string | null>(null);
  const [searchDisplay, setSearchDisplay] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>(
    []
  );
  const [selectedWord, setSelectedWord] = useState<selectedWordProps[]>([]);
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const { userId, username, userImageUrl } = useUser();

  const allUsers = users ? useQuery(api.users.getOnlineUsers) : [];
  const recentWordQuizzes = useQuery(api.words.getUserWordsQuery, {
    userId: userId!,
  });

  const selectedWordData = useQuery(
    api.words.getWordObjectQuery,
    selectedWordName ? { userId: userId!, word: selectedWordName } : "skip"
  );

  const selectedUserData = useQuery(
    api.users.getByUsername,
    selectedUsername ? { username: selectedUsername } : "skip"
  );

  // Use the corrected hook
  const { handleUserSelection } = useUserSelection({
    onReset: () => setSelectedUsername(""),
    onModalClose: () => setIsModalOpen?.(false),
  });

  // Handle user selection with the new approach
  useEffect(() => {
    if (selectedUserData && users && userId && username && userImageUrl) {
      handleUserSelection(selectedUserData, userId, username, userImageUrl);
    }
  }, [selectedUserData]); // Only depend on selectedUserData to prevent multiple triggers

  const handleEmptySearch = (value: string) => {
    if (!value.trim()) {
      setFilteredSuggestions([]);
      return true;
    }
    return false;
  };

  const handleWordQuizFilter = (value: string) => {
    if (!recentWordQuizzes) return [];
    const matched = handleWordFilter({ value, recentWordQuizzes });
    return matched;
  };

  const handleUserFilterFunction = (value: string) => {
    if (!allUsers || !userId) return [];
    const matched = handleUserFilter({ allUsers, userId, value });
    return matched;
  };

  const handleFilter = (value: string) => {
    if (handleEmptySearch(value)) return;
    startTransition(() => {
      let matched = [];
      if (!users) {
        matched = handleWordQuizFilter(value);
      } else {
        matched = handleUserFilterFunction(value);
      }
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

  // Fixed click handler
  const handleSelectWordName = (suggestion: string) => {
    setSelectedWordName(() => {
      setTimeout(() => {
        setSelectedWordName(suggestion);
      }, 0);
      return null;
    });
    setSearchDisplay(suggestion);
  };

  const handleSelectUsername = (suggestion: {
    username: string;
    imageUrl: string;
  }) => {
    setSelectedUsername(suggestion.username);
    setSearchDisplay(suggestion.username);
  };

  const setCleanState = () => {
    setTimeout(() => {
      setSearchDisplay("");
      setFilteredSuggestions([]);
    }, 150);
  };

  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      if (!users && typeof suggestion === "string") {
        handleSelectWordName(suggestion);
      } else if (users && typeof suggestion !== "string") {
        handleSelectUsername(suggestion);
      }
      setCleanState();
    },
    [users]
  );

  const { speak } = useSpeek({ text: selectedWord[0]?.word });

  if (allUsers === undefined || !userId || recentWordQuizzes === undefined) {
    return <Spinner loading={true} />;
  }

  return (
    <div className="h-full flex justify-center items-start">
      <div className="lg:w-[90%] w-full mt-4">
        <Command className="rounded-lg border shadow-md">
          <CommandInput
            placeholder="Type a command or search..."
            value={searchDisplay}
            onValueChange={setSearchDisplay}
          />
          <CommandList>
            <CommandEmpty>
              <span>
                {users
                  ? "No users is online yet."
                  : "You haven't seen any words yet."}
              </span>
            </CommandEmpty>
            <CommandGroup heading="Suggestions">
              {filteredSuggestions.map((suggestion, index) => (
                <CommandItem
                  key={index}
                  className="cursor-pointer"
                  value={
                    users && typeof suggestion !== "string"
                      ? suggestion.username
                      : (suggestion as string)
                  }
                  onSelect={() => handleSuggestionClick(suggestion)}
                >
                  <SuggestionItem suggestion={suggestion} users={users} />
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </CommandList>
        </Command>

        {/* Word Modal */}
        {selectedWord.length > 0 && !users && (
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

const SuggestionItem = ({
  suggestion,
  users,
}: {
  suggestion: Suggestion;
  users: boolean;
}) => {
  if (users && typeof suggestion !== "string") {
    return (
      <div className="flex items-center gap-2">
        <Image
          src={suggestion.imageUrl}
          alt={suggestion.username}
          width={44}
          height={44}
          className="rounded-full border-orange-1 border-2"
        />
        <span>{suggestion.username}</span>
      </div>
    );
  }
  return <span>{suggestion as string}</span>;
};

export default Searchbar;
