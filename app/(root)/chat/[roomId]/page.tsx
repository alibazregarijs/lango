"use client";
import React, {
  useCallback,
  useRef,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { useChatData } from "@/hooks/useChats";
import { useChatQueries } from "@/hooks/useChats";
import { useChatState } from "@/hooks/useChats";
import { useChatActions } from "@/hooks/useChats";
import { type EditMessageModalProps } from "@/types";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const Page = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isMount, setIsMount] = useState(false);
  const { userId, roomId, userSenderId, userTakerId } = useChatData();
  const { messages } = useChatQueries();
  const markAllMessagesAsTrue = useMutation(
    api.Messages.markSenderMessagesInRoom
  );
  const {
    openModal,
    message,
    editMessage,
    setOpenModal,
    setMessage,
    messageIdRef,
    setEditMessage,
    closeModal,
  } = useChatState();

  const { handleRemoveMessage, handleEditMessage, handleSendMessage } =
    useChatActions({
      closeModal,
      message,
      messageIdRef,
      editMessage,
      takerId: userTakerId as string,
      setMessage,
      setEditMessage,
    });

  const getOption = useCallback(
    (value: string, messageId: string) => {
      if (value === "delete") {
        handleRemoveMessage(messageId as any);
      }
      if (value === "edit") {
        messageIdRef.current = messageId;
        setOpenModal(true);
      }
    },
    [handleRemoveMessage, setOpenModal]
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markAllMessagesAsRead = useCallback(async () => {
    if (!messages) return;
    markAllMessagesAsTrue({
      roomId,
      senderId: userId === userSenderId ? userTakerId! : userSenderId!,
      readStatus: true,
    });
    scrollToBottom();
  }, [messages, markAllMessagesAsTrue, roomId, userSenderId]);

  const unReadMessageCount = useMemo(() => {
    if (!messages) return 0;
    return messages.filter(
      (message) => !message.read && message.senderId !== userId
    ).length;
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
    if (messages && messages?.length > 0) {
      markAllMessagesAsTrue({
        roomId,
        senderId: userTakerId!,
        readStatus: true,
      });
    }
  }, [isMount]);

  if (!userId || roomId === undefined || !messages) {
    return <Spinner loading={true} />;
  }

  return (
    <div className="max-h-screen h-full p-4 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-[#1A1D23] rounded-xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[85vh]">
        <ChatHeader />
        <MessageList
          onActionSelect={getOption}
          messagesEndRef={messagesEndRef as React.RefObject<HTMLDivElement>}
          onMount={setIsMount}
          unReadMessageCount={unReadMessageCount}
          onScroll={markAllMessagesAsRead}
        />
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
        />
      </div>

      <EditMessageModal
        open={openModal}
        editMessage={editMessage}
        onOpenChange={setOpenModal}
        onEditMessageChange={setEditMessage}
        onSave={handleEditMessage}
      />
    </div>
  );
};

const EditMessageModal = ({
  open,
  editMessage,
  onOpenChange,
  onEditMessageChange,
  onSave,
}: EditMessageModalProps) => (
  <Modal open={open} onOpenChange={onOpenChange}>
    <Modal.Content>
      <Modal.Section title="Edit your message here.">
        <Modal.Body className="max-sm:flex max-sm:flex-col space-y-4">
          <Input
            value={editMessage}
            onChange={(e) => onEditMessageChange(e.target.value)}
            placeholder="Edit your message..."
            className="w-full"
          />
          <Button onClick={onSave} className="mt-4 cursor-pointer">
            Save Changes
          </Button>
        </Modal.Body>
      </Modal.Section>
    </Modal.Content>
  </Modal>
);

export default Page;
