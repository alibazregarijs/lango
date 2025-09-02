import React from "react";
import { useCallback } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useChatState } from "@/context/ChatStateContext";
import { type Message } from "@/types";
import { useChatActions } from "@/app/(root)/chat/hooks/useChatActions";
import { useMessageManagement } from "@/app/(root)/chat/hooks/useMessageManagement";

const useGetComboOption = ({
  setMessages,
  setOpenModal,
  setReplyedMessage,
}: {
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setReplyedMessage: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const { messageIdRef, messageInputRef } = useChatState();
  const { handleRemoveMessage } = useChatActions({ setMessages });
  const { messages } = useMessageManagement(); //

  const getOption = useCallback(
    (value: string, messageId: string) => {
      if (value === "delete") {
        handleRemoveMessage(messageId as Id<"messages">);
      } else if (value === "edit") {
        messageIdRef.current = messageId;
        setOpenModal(true);
      } else if (value === "reply") {
        messageIdRef.current = messageId;
        messageInputRef.current?.focus();
        setReplyedMessage(
          messages.filter((message) => message._id === messageId)
        );
      }
    },
    [handleRemoveMessage, setOpenModal, messageIdRef, messages]
  );

  return getOption;
};

export default useGetComboOption;
