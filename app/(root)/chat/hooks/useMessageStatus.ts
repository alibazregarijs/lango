import { useMemo , useEffect } from "react";
import { useChatQueries } from "./useChatQueries";
import { useChatMutations } from "./useChatMutations";
import { useChatData } from "./useChatData";

export const useUnreadMessageCount = () => {
  const { messages } = useChatQueries();
  const { userId } = useChatData();

  return useMemo(() => {
    if (!messages) return 0;
    return messages.filter(
      (message) => !message.read && message.senderId !== userId
    ).length;
  }, [messages, userId]);
};

export const useMarkMessagesAsRead = (isMount: boolean) => {
  const { messages } = useChatQueries();
  const { roomId, userId, userSenderId, userTakerId } = useChatData();
  const { markAllMessagesAsTrue } = useChatMutations();

  useEffect(() => {
    if (isMount && messages && messages?.length > 0) {
      markAllMessagesAsTrue({
        roomId,
        senderId: userId === userSenderId ? userTakerId! : userSenderId!,
        readStatus: true,
      });
    }
  }, [
    isMount,
    roomId,
    userTakerId,
    messages,
    markAllMessagesAsTrue,
    userId,
    userSenderId,
  ]);
};
