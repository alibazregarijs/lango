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
import { getGmailUsername } from "@/utils";
import { useMutation } from "convex/react";
import { toast } from "sonner";
import { handleUserFilter, handleWordFilter } from "@/utils/index";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
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
  const { userId, username , userImageUrl } = useUser();

  const allUsers = users ? useQuery(api.users.getOnlineUsers) : [];
  const recentWordQuizzes = useQuery(api.words.getUserWordsQuery, {
    userId: userId!,
  });
  const selectedWordData = useQuery(
    api.words.getWordObjectQuery,
    selectedWordName ? { userId: userId!, word: selectedWordName } : "skip"
  );

  const sendNotification = useMutation(api.Notifications.createNotification);

  const sendNotificationToUser = async (
    userId: string,
    userTakerId: string,
    userSenderName: string,
    userSenderImageUrl: string
  ) => {
    try {
      let routeUrl = "/chat/" + uuidv4();
      const res = await sendNotification({
        userTakerId: userTakerId!,
        userSenderId: userId,
        userSenderImageUrl: userSenderImageUrl,
        userSenderName: userSenderName!,
        text: "Lets have a chat",
        read: false,
        accept: false,
        routeUrl: routeUrl,
      });

      if (res) {
        toast("Chat request sent to the user.");
        selectedUsername && setSelectedUsername("");
        setIsModalOpen!(false);
        router.push(routeUrl);
        return;
      }
      toast("You already have sent a chat request to this user.");
      selectedUsername && setSelectedUsername("");
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  };

  // Fetch user data when a username is selected
  const selectedUserData = useQuery(
    api.users.getByUsername,
    selectedUsername ? { username: selectedUsername } : "skip"
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
  }, [searchDisplay]);

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

  // Handle user data when it becomes available
  useEffect(() => {
    if (selectedUserData && users && userId) {
      sendNotificationToUser(
        userId!,
        selectedUserData.clerkId,
        username!,
        userImageUrl!
      );
    }
  }, [selectedUserData, users, setSelectedUsername , userId]);

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
