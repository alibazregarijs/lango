import React from "react";
import { useChatState } from "@/app/(root)/chat/hooks/useChatState";
import { ChatStateContext } from "@/context/ChatStateContext";

const ChatStateProvider = ({ children }: { children: React.ReactNode }) => {
  const chatState = useChatState();
  return (
    <>
      <ChatStateContext.Provider value={chatState}>
        {children}
      </ChatStateContext.Provider>
    </>
  );
};

export default ChatStateProvider;
