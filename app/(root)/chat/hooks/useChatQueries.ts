import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useChatData } from "./useChatData";

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
  const room = useQuery(
    api.ChatRooms.getChatRoom,
    userSenderId && userTakerId ? { userTakerId, userSenderId } : "skip"
  );

  return { userSender, userTaker, messages , room };
};