import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

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