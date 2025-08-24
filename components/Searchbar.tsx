"use client";
import React, { useState, startTransition, useEffect, useCallback } from "react";
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
import Spinner from "@/components/Spinner";
import { toast } from "sonner";
import { handleUserFilter, handleWordFilter } from "@/utils/index";
import { useRouter } from "next/navigation";
import { useNotification } from "@/hooks/useNotification"; // Import the custom hook

const Searchbar = ({
  users = false,
  setIsModalOpen,
}: {
  users?: boolean;
  setIsModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedWordName, setSelectedWordName] = useState<string | null>(null);
  const [searchDisplay, setSearchDisplay] = useState("");
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<selectedWordProps[]>([]);
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const router = useRouter();
  const { userId, username, userImageUrl } = useUser();
  const { sendNotificationToUser } = useNotification(); // Use the custom hook

  const allUsers = users ? useQuery(api.users.getOnlineUsers) : [];
  const recentWordQuizzes = useQuery(api.words.getUserWordsQuery, {
    userId: userId!,
  });
  const selectedWordData = useQuery(
    api.words.getWordObjectQuery,
    selectedWordName ? { userId: userId!, word: selectedWordName } : "skip"
  );

  // Fetch user data when a username is selected
  const selectedUserData = useQuery(
    api.users.getByUsername,
    selectedUsername ? { username: selectedUsername } : "skip"
  );

  // Handle user data when it becomes available
  useEffect(() => {
    const handleUserSelection = async () => {
      if (selectedUserData && users && userId) {
        const result = await sendNotificationToUser(
          userId!,
          selectedUserData.clerkId,
          username!,
          userImageUrl!,
          selectedUserData.imageUrl
        );
        
        if (result.success) {
          setSelectedUsername("");
          setIsModalOpen?.(false);
          router.push(
            `${result.routeUrl}?userSenderId=${userId}&userTakerId=${selectedUserData.clerkId}&imageUrl=${selectedUserData.imageUrl}`
          );
        } else {
          toast(result.message);
          setSelectedUsername("");
        }
      }
    };

    handleUserSelection();
  }, [selectedUserData, users, userId, username, userImageUrl, sendNotificationToUser, setIsModalOpen, router]);

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
      let matched: string[] = [];

      if (!users) {
        // Add null check for recentWordQuizzes
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
  }, [searchDisplay, debouncedFilter]);

  useEffect(() => {
    if (selectedWordData) {
      setSelectedWord(selectedWordData);
      setOpen(true);
    }
  }, [selectedWordData]);

  const handleSuggestionClick = (selectedItem: string) => {
    setSearchDisplay(selectedItem);
    if (users) {
      setSelectedUsername(selectedItem);
    } else {
      setSelectedWordName(selectedItem);
    }
    setSearchDisplay("");
  };

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
                {users ? "No users found" : "You haven't seen any words yet."}
              </span>
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