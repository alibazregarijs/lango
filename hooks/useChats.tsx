import { useSearchParams, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/context/UserContext";
import { formatDate } from "@/utils";
import { useState, useRef, useCallback } from "react";

export const useChatData = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { userId, userImageUrl } = useUser();

  const userSenderId = searchParams.get("userSenderId");
  const userTakerId = searchParams.get("userTakerId");
  const imageUrl = searchParams.get("imageUrl");
  const roomId = params.roomId as string;

  return {
    userSenderId,
    userTakerId,
    imageUrl,
    roomId,
    userId,
    userImageUrl,
  };
};

export const useChatQueries = () => {
  const { userSenderId, userTakerId, roomId } = useChatData();

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

  return { userSender, userTaker, messages };
};

export const useChatMutations = () => {
  const createMessage = useMutation(api.Messages.createMessage);
  const editMessageMutation = useMutation(api.Messages.updateMessage);
  const deleteMessage = useMutation(api.Messages.deleteMessage);

  return { createMessage, editMessageMutation, deleteMessage };
};

export const useChatState = () => {
  const [openModal, setOpenModal] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [editMessage, setEditMessage] = useState<string>("");
  const messageIdRef = useRef<string | null>(null);

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
  };
};

export const useChatActions = ({
  closeModal,
  message,
  messageIdRef,
  editMessage,
  setMessage,
  setEditMessage,
  takerId
}: {
  closeModal: () => void;
  message: string;
  messageIdRef: React.MutableRefObject<string | null>;
  editMessage: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage: React.Dispatch<React.SetStateAction<string>>;
  takerId: string
}) => {
  const { createMessage, editMessageMutation, deleteMessage } =
    useChatMutations();

  const { roomId, userId } = useChatData();

  const handleRemoveMessage = useCallback(
    async (messageId: Id<"messages">) => {
      await deleteMessage({ messageId });
    },
    [deleteMessage]
  );

  const handleEditMessage = useCallback(async () => {
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
      closeModal();
      setEditMessage("");
    }
  }, [
    editMessage,
    messageIdRef,
    editMessageMutation,
    closeModal,
    setEditMessage,
  ]);

  const handleSendMessage = useCallback(async () => {
    if (!message || !userId) return;
    try {
      await createMessage({
        roomId,
        senderId: userId,
        takerId:takerId,
        content: message,
        replyToId: undefined,
        read: false,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message, createMessage, roomId, userId, setMessage]);

  return {
    handleRemoveMessage,
    handleEditMessage,
    handleSendMessage,
  };
};

export const useOnlineStatus = () => {
  const { userSender, userTaker } = useChatQueries();
  const { userId, userTakerId } = useChatData();

  const displayUser = userId === userTakerId ? userSender : userTaker;
  const isOnline = displayUser?.online;
  const onlineStatus = isOnline ? "text-green-400" : "text-gray-400";
  const statusText = isOnline ? "Online" : "Offline";

  const getStatusDisplay = () => {
    if (userId === userTakerId) {
      return userSender?.lastSeen && !userSender.online
        ? formatDate(userSender.lastSeen)
        : statusText;
    } else {
      return userTaker?.lastSeen && !userTaker.online
        ? formatDate(userTaker.lastSeen)
        : statusText;
    }
  };

  return {
    displayUser,
    isOnline,
    onlineStatus,
    statusText: getStatusDisplay(),
  };
};
