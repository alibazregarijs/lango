import { useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { Id } from "@/convex/_generated/dataModel";
import { type Message } from "@/types";
import { useChatMutations } from "./useChatMutations";
import { useChatQueries } from "./useChatQueries";
import { useChatData } from "./useChatData";
import { useScrollToBottom } from "./useScrollManagement";
import { useChatState } from "@/context/ChatStateContext";

export const useChatActions = ({
  closeModal,
  setMessage,
  setEditMessage,
  setMessages,
}: {
  closeModal?: () => void;
  setMessage?: React.Dispatch<React.SetStateAction<string>>;
  setEditMessage?: React.Dispatch<React.SetStateAction<string>>;
  setMessages?: React.Dispatch<React.SetStateAction<Message[]>>;
}) => {
  const {
    message,
    messageIdRef,
    editMessage,
    replyedMessage,
    handleCancleReply: onCancelReply,
  } = useChatState();
  const { userTakerId: takerId } = useChatData();
  const { scrollToBottom: onScroll } = useScrollToBottom();

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
      if (!setMessages) return;
      setMessages((prev: Message[]) => {
        return prev.filter((msg) => msg._id !== messageId);
      });
      try {
        await deleteMessage({ messageId });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    },
    [deleteMessage, setMessages, messageIdRef]
  );

  const handleEditMessage = useCallback(async () => {
    if (
      !editMessage ||
      !messageIdRef.current ||
      !setMessages ||
      !closeModal ||
      !setEditMessage
    )
      return;
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
    if (!message || !userId || !setMessages || !setMessage) return;
    let reply: { content: string; senderId: string } | undefined;
    if (replyedMessage[0]) {
      reply = {
        content: replyedMessage[0].content,
        senderId: userId,
      };
    } else {
      reply = undefined;
    }
    try {
      setMessages((prev) => {
        const prevState = [...prev];
        const newMessage = {
          _id: uuidv4(),
          _creationTime: Date.now(),
          roomId,
          senderId: userId,
          takerId: takerId,
          content: message,
          replyToId: reply,
          read: false,
        };
        return [...prevState, newMessage];
      });

      setMessage("");
      onCancelReply();
      await createMessage({
        roomId,
        senderId: userId,
        takerId: takerId as string,
        content: message,
        replyToId: (messageIdRef.current as Id<"messages">) ?? undefined,
        read: false,
      });

      messageIdRef.current = null;
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
