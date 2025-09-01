import { useState, useEffect } from "react";
import { type Message } from "@/types";
import { useChatQueries } from "./useChatQueries";

export const useMessageManagement = () => {
  const { messages: messageQuery } = useChatQueries();
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(
    messageQuery as Message[]
  );

  useEffect(() => {
    setIsLoading(true);
    if (messageQuery) {
      setMessages(messageQuery);
      setIsLoading(false);
    }
  }, [messageQuery]);

  return {
    messages,
    setMessages,
    isLoading
  };
};