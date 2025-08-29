import { useSearchParams, useParams } from "next/navigation";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@/context/UserContext";
import { formatDate } from "@/utils";
import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { type Message } from "@/types";
import { v4 as uuidv4 } from "uuid";

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
  const markAllMessagesAsTrue = useMutation(
    api.Messages.markSenderMessagesInRoom
  );

  return {
    createMessage,
    editMessageMutation,
    deleteMessage,
    markAllMessagesAsTrue,
  };
};

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

export const fetchMessages = () => {
  const { messages: messageQuery } = useChatQueries();
  const [messages, setMessages] = useState<Message[]>(
    messageQuery as Message[]
  );

  useEffect(() => {
    if (messageQuery) {
      setMessages(messageQuery);
    }
  }, [messageQuery]); // Dependency array ensures sync on data change

  return {
    messages,
    setMessages,
  };
};

export const useAutoScrollOnMount = (
  isMount: boolean,
  scrollToBottom: () => void
) => {
  useEffect(() => {
    if (isMount) {
      scrollToBottom();
    }
  }, [isMount]);
};

export const useScrollToBottom = ({
  messagesEndRef,
}: {
  messagesEndRef: React.RefObject<HTMLDivElement> | null;
}) => {
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef?.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });

      setTimeout(() => {}, 500);
    }
  }, []);

  return { scrollToBottom };
};

export const calculateUnReadMessageCount = () => {
  const { messages } = useChatQueries();
  const { userId } = useChatData();
  const unReadMessageCount = useMemo(() => {
    if (!messages) return 0;
    return messages.filter(
      (message) => !message.read && message.senderId !== userId
    ).length;
  }, [messages]);

  return unReadMessageCount;
};

export const useMarkMessagesAsRead = (isMount: boolean) => {
  const { messages } = useChatQueries();
  const { roomId, userTakerId, userId, userSenderId } = useChatData();
  const { markAllMessagesAsTrue } = useChatMutations();
  useEffect(() => {
    if (isMount && messages && messages?.length > 0) {
      markAllMessagesAsTrue({
        roomId,
        senderId: userId === userSenderId ? userTakerId! : userSenderId!,
        readStatus: true,
      });
    }
  }, [isMount, roomId, userTakerId]);
};

export const useChatActions = ({
  closeModal,
  message,
  messageIdRef,
  editMessage,
  setMessage,
  setEditMessage,
  takerId,
  onScroll,
  setMessages,
}: {
  closeModal: () => void;
  message: string;
  messageIdRef: React.MutableRefObject<string | null>;
  editMessage: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage: React.Dispatch<React.SetStateAction<string>>;
  takerId: string;
  onScroll: () => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const {
    createMessage,
    editMessageMutation,
    deleteMessage,
    markAllMessagesAsTrue,
  } = useChatMutations();

  const { messages } = useChatQueries();
  const { roomId, userId, userSenderId, userTakerId } = useChatData();

  const handleRemoveMessage = useCallback(
    async (messageId: Id<"messages">) => {
      setMessages((prev: Message[]) => {
        return prev.filter((msg) => msg._id !== messageIdRef.current);
      });
      await deleteMessage({ messageId });
    },
    [deleteMessage]
  );

  const handleEditMessage = useCallback(async () => {
    if (!editMessage || !messageIdRef.current) return;
    try {
      setMessages((prev: Message[]) => {
        return prev.map((msg) => {
          if (msg._id === messageIdRef.current) {
            return {
              ...msg,
              content: editMessage,
              _creationTime: Date.now(),
            };
          }
          return msg;
        });
      });
      closeModal();
      setEditMessage("");
      await editMessageMutation({
        messageId: messageIdRef.current as Id<"messages">,
        content: editMessage,
      });
      messageIdRef.current = null;
    } catch (error) {
      console.error("Error editing message:", error);
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
      setMessages((prev) => {
        let prevState = [...prev];
        let newMessage = {
          _id: uuidv4(),
          _creationTime: Date.now(),
          roomId,
          senderId: userId,
          takerId: takerId,
          content: message,
          replyToId: undefined,
          read: false,
        };
        return [...prevState, newMessage];
      });
      setMessage("");
      await createMessage({
        roomId,
        senderId: userId,
        takerId: takerId,
        content: message,
        replyToId: undefined,
        read: false,
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [message, createMessage, roomId, userId, setMessage]);

  const markAllMessagesAsRead = useCallback(async () => {
    if (!messages) return;
    markAllMessagesAsTrue({
      roomId,
      senderId: userId === userSenderId ? userTakerId! : userSenderId!,
      readStatus: true,
    });
    onScroll();
  }, [messages, markAllMessagesAsTrue, roomId, userSenderId]);

  return {
    handleRemoveMessage,
    handleEditMessage,
    handleSendMessage,
    markAllMessagesAsRead,
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
