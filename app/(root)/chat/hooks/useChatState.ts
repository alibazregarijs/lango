import { useState, useRef, useCallback } from "react";
import { type Message } from "@/types";

export const useChatState = () => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const messageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMount, setIsMount] = useState(false);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const [replyedMessage, setReplyedMessage] = useState<Message[]>([]);
  const [_, setCancleReply] = useState<boolean>(false);

  const closeModal = useCallback(() => setOpenModal(false), []);
  const openModalFn = useCallback(() => setOpenModal(true), []);
  const handleCancleReply = useCallback(() => {
    setCancleReply(false);
  }, []);

  return {
    openModal,
    message,
    editMessage,
    messageIdRef,
    setOpenModal,
    setMessage,
    setEditMessage,
    closeModal,
    openModalFn,
    messagesEndRef,
    isMount,
    setIsMount,
    messageInputRef,
    replyedMessage,
    handleCancleReply,
    setReplyedMessage,
  };
};
