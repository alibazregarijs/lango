import Image from "next/image";
import { Button } from "./ui/button";
import { useOnlineStatus } from "@/app/(root)/chat/hooks/useOnlineStatus";
import { useChatData } from "@/app/(root)/chat/hooks/useChatData";
import { useChatQueries } from "@/app/(root)/chat/hooks/useChatQueries";

export const ChatHeader = () => {
  const { displayUser, isOnline, onlineStatus, statusText } = useOnlineStatus();
  const { userId: currentUserId, userSenderId } = useChatData();
  const { room } = useChatQueries();
  const userSenderOnPage = currentUserId === userSenderId;

  // Determine if the other user is typing
  
  const isTyping =
    (!userSenderOnPage && room?.userSenderTyping) ||
    (userSenderOnPage && room?.userTakerTyping);

  return (
    <div className="sm:flex sm:flex-row flex-col justify-between items-center p-4 border-b border-gray-800 bg-[#1A1D23]">
      <div className="flex items-center space-x-3 space-y-3">
        <div className="relative">
          <Image
            width={48}
            height={48}
            className="rounded-full border-2 border-orange-500 shadow-lg"
            src={displayUser?.imageUrl || ""}
            alt="User avatar"
          />
          <div
            className={`absolute bottom-0 right-0 w-3 h-3 ${isOnline ? "bg-green-500" : "bg-gray-500"} rounded-full border-2 border-[#1A1D23]`}
          ></div>
        </div>
        <div className="flex flex-col">
          <span className="text-white font-semibold">
            {displayUser?.name || "Unknown User"}
          </span>
          {isTyping ? (
            <div className="flex items-center h-5">
              <span className="text-sm text-gray-400 flex items-center">
                <span className="flex space-x-1 ml-1">
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="h-1 w-1 bg-gray-400 rounded-full animate-bounce"></span>
                </span>
                <span className="ml-1">Typing</span>
              </span>
            </div>
          ) : (
            <span className={`${onlineStatus} text-sm flex items-center h-5`}>
              <span
                className={`w-2 h-2 ${isOnline ? "bg-green-500 animate-pulse" : "bg-gray-500"} rounded-full mr-1`}
              ></span>
              {statusText}
            </span>
          )}
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
