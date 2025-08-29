import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Id } from "@/convex/_generated/dataModel";
import { type Message } from "@/types";
import { useChatMutations } from "./useChatMutations";
import { useChatQueries } from "./useChatQueries";
import { useChatData } from "./useChatData";

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
        return prev.filter((msg) => msg._id !== messageId);
      });
      await deleteMessage({ messageId });
    },
    [deleteMessage, setMessages, messageIdRef]
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
    setMessages,
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
  }, [
    message,
    createMessage,
    roomId,
    userId,
    setMessage,
    setMessages,
    takerId,
  ]);

  const markAllMessagesAsRead = useCallback(async () => {
    if (!messages) return;
    markAllMessagesAsTrue({
      roomId,
      senderId: userId === userSenderId ? userTakerId! : userSenderId!,
      readStatus: true,
    });
    onScroll();
  }, [
    messages,
    markAllMessagesAsTrue,
    roomId,
    userSenderId,
    userTakerId,
    userId,
    onScroll,
  ]);

  return {
    handleRemoveMessage,
    handleEditMessage,
    handleSendMessage,
    markAllMessagesAsRead,
  };
};
