import React from "react";
import { useSearchParams } from "next/navigation";
import { useParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useQuery, useMutation, ReactMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useState, useCallback } from "react";
import { useRef } from "react";

const useChats = () => {
  return {};
};

export const useChatState = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { userId, userImageUrl } = useUser();

  const userSenderId = searchParams.get("userSenderId");
  const userTakerId = searchParams.get("userTakerId");
  const imageUrl = searchParams.get("imageUrl");
  const roomId = params.roomId as string;

  const [message, setMessage] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const messageIdRef = useRef<string | null>(null);

  return {
    userSenderId,
    userTakerId,
    imageUrl,
    roomId,
    userId,
    userImageUrl,

    message,
    editMessage,
    messageIdRef,
    setMessage,
    setEditMessage,
  };
};

export const useChatsQuery = ({
  userSenderId,
  userTakerId,
  roomId,
}: {
  userSenderId: string;
  userTakerId: string;
  roomId: string;
}) => {
  const userSender = useQuery(
    api.users.getUserById,
    userSenderId ? { clerkId: userSenderId as Id<"users"> } : "skip"
  );
  const userTaker = useQuery(
    api.users.getUserById,
    userTakerId ? { clerkId: userTakerId as Id<"users"> } : "skip"
  );
  const messages = useQuery(
    api.ChatRooms.getMessagesByRoom,
    roomId ? { roomId } : "skip"
  );
  const createMessage = useMutation(api.Messages.createMessage);
  const editMessageMutation = useMutation(api.Messages.updateMessage);
  const deleteMessage = useMutation(api.Messages.deleteMessage);

  return {
    // data
    userSender,
    userTaker,
    messages,

    // actions
    createMessage,
    editMessageMutation,
    deleteMessage,
  };
};

export const useChatsModal = () => {
  const [openModal, setOpenModal] = useState(false);

  const closeModalFunction = useCallback(() => {
    setOpenModal(false);
  }, [setOpenModal]);

  const openModalFunction = useCallback(() => {
    setOpenModal(true);
  }, [setOpenModal]);

  return {
    openModal,
    closeModalFunction,
    openModalFunction,
    setOpenModal,
  };
};

export const useCheckOnlineStatus = ({
  userId,
  userTakerId,
  isUserSenderOnline,
  isUserTakerOnline,
}: {
  userId: string;
  userTakerId: string;
  isUserSenderOnline: boolean;
  isUserTakerOnline: boolean;
}) => {
  const getOnlineStatus = () => {
    if (userId === userTakerId) {
      return isUserSenderOnline ? "text-green-400" : "text-gray-400";
    } else {
      return isUserTakerOnline ? "text-green-400" : "text-gray-400";
    }
  };

  const onlineStatus = getOnlineStatus();
  const isOnline = onlineStatus === "text-green-400";
  const statusText = isOnline ? "Online" : "Offline";

  return {
    onlineStatus,
    isOnline,
    statusText,
  };
};

export const useGetOption = ({
  deleteMessageAction, // action that we take from useQuery
  messageIdRef,
  onOpenModal,
}: {
  deleteMessageAction: ReactMutation<typeof api.Messages.deleteMessage>;
  messageIdRef: React.RefObject<string | null>;
  onOpenModal: () => void;
}) => {
  const getOption = useCallback(
    (value: string, messageId: string) => {
      if (value === "delete") {
        ChatService.handleRemoveMessage(
          deleteMessageAction,
          messageId as Id<"messages">
        );
      }
      if (value === "edit") {
        messageIdRef.current = messageId;
        onOpenModal();
      }
    },
    [deleteMessageAction]
  );
  return getOption;
};

export class ChatService {
  static async handleRemoveMessage(
    deleteMessage: ReactMutation<typeof api.Messages.deleteMessage>,
    messageId: Id<"messages">
  ) {
    try {
      await deleteMessage({
        messageId: messageId,
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  static async handleEditMessage({
    editMessage,
    editMessageMutation,
    messageIdRef,
    onCloseModal,
    setEditMessage,
  }: {
    editMessage: string;
    editMessageMutation: ReactMutation<typeof api.Messages.updateMessage>;
    messageIdRef: React.RefObject<string | null>;
    onCloseModal: () => void;
    setEditMessage: React.Dispatch<React.SetStateAction<string>>;
  }) {
    if (!editMessage || !messageIdRef.current) return;
    try {
      await editMessageMutation({
        messageId: messageIdRef.current as Id<"messages">,
        content: editMessage,
      });
      messageIdRef.current = null;
    } catch (error) {
      console.error("Error editing message:", error);
    } finally {
      onCloseModal();
      setEditMessage("");
    }
  }

  static async handleSendMessage({
    message,
    createMessage,
    roomId,
    userId,
    onEmptyMessage,
  }: {
    message: string;
    createMessage: ReactMutation<typeof api.Messages.createMessage>;
    roomId: string;
    userId: string;
    onEmptyMessage: () => void;
  }) {
    if (!message) return;
    try {
      await createMessage({
        roomId: roomId,
        senderId: userId,
        content: message,
        replyToId: undefined,
        read: false,
      });
      onEmptyMessage();
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
}

export default useChats;
