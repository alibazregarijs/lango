import { useState, useRef, useCallback } from "react";

export const useChatState = () => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const messageIdRef = useRef<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [isMount, setIsMount] = useState(false);

  const closeModal = useCallback(() => setOpenModal(false), []);
  const openModalFn = useCallback(() => setOpenModal(true), []);

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
  };
};
