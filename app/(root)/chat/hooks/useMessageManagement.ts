import { useState, useEffect } from "react";
import { type Message } from "@/types";
import { useChatQueries } from "./useChatQueries";

export const useMessageManagement = () => {
  const { messages: messageQuery } = useChatQueries();
  const [messages, setMessages] = useState<Message[]>(
    messageQuery as Message[]
  );

  useEffect(() => {
    if (messageQuery) {
      setMessages(messageQuery);
    }
  }, [messageQuery]);

  return {
    messages,
    setMessages,
  };
};