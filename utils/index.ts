import { toast } from "sonner";

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

