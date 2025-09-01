
"use client";
import { type Message } from "@/types";
import { createContext, useContext } from "react";

type UserChatStateContextType = {
  openModal: boolean;
  message: string;
  editMessage: string;
  messageIdRef: React.RefObject<string | null>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage: React.Dispatch<React.SetStateAction<string>>;
  closeModal: () => void;
  openModalFn: () => void;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  isMount: boolean;
  setIsMount: React.Dispatch<React.SetStateAction<boolean>>;
  messageInputRef: React.RefObject<HTMLInputElement | null>;
  replyedMessage: Message[];
  handleCancleReply: () => void;
  setReplyedMessage: React.Dispatch<React.SetStateAction<Message[]>>;
};

export const ChatStateContext = createContext<UserChatStateContextType | null>(
  null
);

export const useChatState = () => {
  const context = useContext(ChatStateContext);
  if (!context) {
    throw new Error("useChatState must be used within a ChatStateProvider");
  }
  return context;
};

