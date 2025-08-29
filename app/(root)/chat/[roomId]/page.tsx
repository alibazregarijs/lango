"use client";
import React, { useCallback, useMemo, memo, useState } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { Id } from "@/convex/_generated/dataModel";

import { useChatState } from "@/app/(root)/chat/hooks/useChatState";
import { useChatData } from "@/app/(root)/chat/hooks/useChatData";
import { useChatActions } from "@/app/(root)/chat/hooks/useChatActions";
import { useMarkMessagesAsRead } from "@/app/(root)/chat/hooks/useMessageStatus";
import { useAutoScrollOnMount } from "@/app/(root)/chat/hooks/useScrollManagement";
import { useUnreadMessageCount } from "@/app/(root)/chat/hooks/useMessageStatus";
import { useScrollToBottom } from "@/app/(root)/chat/hooks/useScrollManagement";
import { useMessageManagement } from "@/app/(root)/chat/hooks/useMessageManagement";
import { type EditMessageModalProps } from "@/types";

const Page = memo(() => {
  const { userId, roomId, userTakerId } = useChatData();
  const { messages, setMessages } = useMessageManagement();

  const {
    openModal,
    message,
    editMessage,
    setOpenModal,
    setMessage,
    messageIdRef,
    setEditMessage,
    closeModal,
    messagesEndRef,
    isMount,
    setIsMount,
  } = useChatState();

  const { scrollToBottom } = useScrollToBottom({ messagesEndRef: messagesEndRef as React.RefObject<HTMLDivElement> | null });

  const {
    handleRemoveMessage,
    handleEditMessage,
    handleSendMessage,
    markAllMessagesAsRead,
  } = useChatActions({
    closeModal,
    message,
    messageIdRef,
    editMessage,
    takerId: userTakerId as string,
    setMessage,
    setEditMessage,
    onScroll: scrollToBottom,
    setMessages,
  });

  const getOption = useCallback(
    (value: string, messageId: string) => {
      if (value === "delete") {
        handleRemoveMessage(messageId as Id<"messages">);
      }
      if (value === "edit") {
        messageIdRef.current = messageId;
        setOpenModal(true);
      }
    },
    [handleRemoveMessage, setOpenModal, messageIdRef]
  );

  const unReadMessageCount = useUnreadMessageCount();

  useAutoScrollOnMount(isMount as boolean, scrollToBottom);
  useMarkMessagesAsRead(isMount);

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
          messages={messages}
        />
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          scrollOnSendMessage={scrollToBottom}
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
});

Page.displayName = "Page";

const EditMessageModal = memo(
  ({
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
  )
);

EditMessageModal.displayName = "EditMessageModal";

export default Page;
