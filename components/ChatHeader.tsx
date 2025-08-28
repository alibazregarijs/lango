import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { useChatState } from "@/hooks/useChats";
import { useChatsQuery } from "@/hooks/useChats";
import { useCheckOnlineStatus } from "@/hooks/useChats";
import { getStatusText } from "@/utils";
import { allUsersProps } from "@/types";

const ChatHeader = () => {
  const { userTakerId, userId, roomId, userSenderId } = useChatState();
  const { userSender, userTaker } = useChatsQuery();
  const { onlineStatus, isOnline, statusText } = useCheckOnlineStatus();

  // Determine which user to display
  const displayUser = userId === userTakerId ? userSender : userTaker;
  const imageUrl = displayUser?.imageUrl;

  // Only render the image if we have a valid URL
  const shouldRenderImage = imageUrl && imageUrl.trim() !== "";
  
  return (
    <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1A1D23]">
      <div className="flex items-center space-x-3">
        <div className="relative">
          {shouldRenderImage ? (
            <Image
              width={48}
              height={48}
              className="rounded-full border-2 border-orange-500 shadow-lg"
              src={imageUrl}
              alt={`${displayUser?.name || "User"} profile`}
            />
          ) : (
            // Fallback UI when no image is available
            <div className="w-12 h-12 rounded-full border-2 border-orange-500 bg-gray-600 flex items-center justify-center text-white font-semibold shadow-lg">
              {displayUser?.name?.[0]?.toUpperCase() || "U"}
            </div>
          )}
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-green-500" : "bg-gray-500"} rounded-full border-2 border-[#1A1D23]`}
          ></div>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold">
            {displayUser?.name || "Unknown User"}
          </span>
          <span className={`${onlineStatus} text-sm flex items-center`}>
            <span
              className={`w-2 h-2 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"} rounded-full mr-1`}
            ></span>
            {getStatusText()}
          </span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Button
          variant="outline"
          className="bg-transparent cursor-pointer text-gray-300 border-gray-700 hover:bg-gray-800"
        >
          Cancel Chat
        </Button>
        <Button className="bg-red-500 cursor-pointer hover:bg-red-600 text-white">
          Delete Chat
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
