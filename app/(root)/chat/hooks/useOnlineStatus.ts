import { useChatQueries } from "./useChatQueries";
import { useChatData } from "./useChatData";
import { formatDate } from "@/utils";

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
