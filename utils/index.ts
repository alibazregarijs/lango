import { toast } from "sonner";
import { type selectedWordProps } from "@/types";
import { type allUsersProps } from "@/types";
import { useCallback } from "react";

const LEVEL_OF_PLAYERS = [10, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
let PLAYER_LEVEL = 0;

export const checkNull = (text: string, children: React.ReactNode): boolean => {
  if (!text.trim()) {
    toast("Text must not be empty", {
      description: children,
      action: {
        label: "Undo",
        onClick: () => {},
      },
    });
    return false;
  }
  return true;
};

export const getPlayerLevel = (score: number): number => {
  for (let i = 0; i < LEVEL_OF_PLAYERS.length; i++) {
    if (score! < LEVEL_OF_PLAYERS[0]) {
      PLAYER_LEVEL = 1;
      break;
    }
    if (
      score! >= LEVEL_OF_PLAYERS[i] &&
      (i === LEVEL_OF_PLAYERS.length - 1 || score! < LEVEL_OF_PLAYERS[i + 1])
    ) {
      PLAYER_LEVEL = i + 1;
      break;
    }
    if (score! > LEVEL_OF_PLAYERS[LEVEL_OF_PLAYERS.length - 1]) {
      PLAYER_LEVEL = LEVEL_OF_PLAYERS.length;
      break;
    }
  }
  return PLAYER_LEVEL;
};

export function getGmailUsername(email: string): string | null {
  const gmailRegex = /^([^@]+)@gmail\.com$/i;
  const match = email.match(gmailRegex);
  return match ? match[1] : null;
}

export const formatDate = (timestamp: number) => {
  return new Date(timestamp).toLocaleString();
};

export const handleWordFilter = ({
  value,
  recentWordQuizzes,
}: {
  value: string;
  recentWordQuizzes: selectedWordProps[];
}) => {
  try {
    return (
      recentWordQuizzes
        ?.filter((suggestion) =>
          suggestion.word.toLowerCase().includes(value.toLowerCase())
        )
        .map((s) => s.word)
        .filter((word): word is string => word !== undefined) ?? []
    );
  } catch (error) {
    console.error("Error filtering words:", error);
    return [];
  }
};

export const handleUserFilter = ({
  allUsers,
  userId,
  value,
}: {
  allUsers: allUsersProps[];
  userId: string;
  value: string;
}) => {
  try {
    return (
      allUsers
        ?.filter((user: allUsersProps) => {
          const username = user.email ? getGmailUsername(user.email) : null;
          return (
            user &&
            username?.toLowerCase().includes(value.toLowerCase()) &&
            userId !== user.clerkId
          );
        })
        .map((user: allUsersProps) => {
          const username = user.email ? getGmailUsername(user.email) : null;
          return username
            ? { username, imageUrl: user.imageUrl }
            : null;
        })
        .filter(
          (user): user is { username: string; imageUrl: string } => user !== null
        ) ?? []
    );
  } catch (error) {
    console.error("Error filtering users:", error);
    return [];
  }
};

