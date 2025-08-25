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
import { toast } from "sonner";
import { handleUserFilter, handleWordFilter } from "@/utils/index";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification";

type Suggestion = string | { username: string; imageUrl: string };

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

  const router = useRouter();
  const { userId, username, userImageUrl } = useUser();
  const { sendNotificationToUser } = useNotification();

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

  useEffect(() => {
    let flag = true;
    const handleUserSelection = async () => {
      if (selectedUserData && users && userId) {
        const result = await sendNotificationToUser(
          userId!,
          selectedUserData.clerkId,
          username!,
          userImageUrl!
        );

        if (result.success && flag) {
          setSelectedUsername("");
          setIsModalOpen?.(false);
          router.push(
            `${result.routeUrl}?userSenderId=${userId}&userTakerId=${selectedUserData.clerkId}&imageUrl=${selectedUserData.imageUrl}`
          );
        } else {
          setSelectedUsername("");
        }
      }
    };

    handleUserSelection();
    return () => {
      flag = false;
    };
  }, [selectedUserData, users, userId]);

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
      let matched = [];

      if (!users) {
        matched = recentWordQuizzes
          ? handleWordFilter({ value, recentWordQuizzes })
          : [];
      } else {
        matched =
          allUsers && userId
            ? handleUserFilter({ allUsers, userId, value })
            : [];
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
  const handleSuggestionClick = useCallback(
    (suggestion: Suggestion) => {
      if (!users && typeof suggestion === "string") {
        // Batch related state updates together
        setSelectedWordName((prev) => {
          // Reset and set in the same render cycle using a callback
          setTimeout(() => {
            setSelectedWordName(suggestion);
          }, 0);
          return null;
        });
        setSearchDisplay(suggestion);
      } else if (users && typeof suggestion !== "string") {
        setSelectedUsername(suggestion.username);
        setSearchDisplay(suggestion.username);
      }

      // Clear UI state after interaction is complete
      setTimeout(() => {
        setSearchDisplay("");
        setFilteredSuggestions([]);
      }, 150);
    },
    [users]
  );

  const { speak } = useSpeek({ text: selectedWord[0]?.word });

  if (!userId) return <Spinner loading={true} />;

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
                  {users && typeof suggestion !== "string" ? (
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
                  ) : (
                    <span>{suggestion as string}</span>
                  )}
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

export default Searchbar;
