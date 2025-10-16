"use client";
import React, { memo, use, useEffect, useState } from "react";
import { Modal } from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { ChatHeader } from "@/components/ChatHeader";
import { MessageList } from "@/components/MessageList";
import { MessageInput } from "@/components/MessageInput";
import { type EditMessageModalProps, type Message } from "@/types";

import { useChatState } from "@/context/ChatStateContext";
import { useChatData } from "@/app/(root)/chat/hooks/useChatData";
import { useChatActions } from "@/app/(root)/chat/hooks/useChatActions";
import { useMarkMessagesAsRead } from "@/app/(root)/chat/hooks/useMessageStatus";
import { useAutoScrollOnMount } from "@/app/(root)/chat/hooks/useScrollManagement";
import { useScrollToBottom } from "@/app/(root)/chat/hooks/useScrollManagement";
import { useMessageManagement } from "@/app/(root)/chat/hooks/useMessageManagement";
import useGetComboOption from "@/app/(root)/chat/hooks/useGetComboOption";

const Page = memo(() => {
  const { userId, roomId } = useChatData();
  const { messages, setMessages } = useMessageManagement();

  const {
    setOpenModal,
    setMessage,
    setEditMessage,
    closeModal,
    isMount,
    setIsMount,
    setReplyedMessage,
  } = useChatState();

  const { scrollToBottom } = useScrollToBottom();

  const { handleEditMessage, handleSendMessage, markAllMessagesAsRead } =
    useChatActions({
      closeModal,
      setMessage,
      setEditMessage,
      setMessages,
    });

  const getOption = useGetComboOption({
    setMessages,
    setOpenModal,
    setReplyedMessage,
  });

  useAutoScrollOnMount(isMount as boolean, scrollToBottom);
  useMarkMessagesAsRead(isMount);

  if (!userId || roomId === undefined || !messages) {
    return <Spinner loading={true} />;
  }

  return (
    <div className="max-h-screen h-full p-4 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-[#1A1D23] rounded-xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[85vh]">
        <ChatHeader/>
        <MessageList
          onActionSelect={getOption}
          onMount={setIsMount}
          onScroll={markAllMessagesAsRead}
          messages={messages as Message[]}
        />
        <MessageInput
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
    
        />
      </div>

      <EditMessageModal
        onOpenChange={setOpenModal}
        onEditMessageChange={setEditMessage}
        onSave={handleEditMessage}
      />
    </div>
  );
});

Page.displayName = "Page";

const EditMessageModal = memo(
  ({ onOpenChange, onEditMessageChange, onSave }: EditMessageModalProps) => {
    const { openModal: open, editMessage } = useChatState();
    return (
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
  }
);

EditMessageModal.displayName = "EditMessageModal";

export default Page;
