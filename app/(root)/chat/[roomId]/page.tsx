"use client";
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useSearchParams, useParams } from "next/navigation";
import { useQuery , useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";
import { formatDate } from "@/utils";
import { useState } from "react";


const Page = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const { userId, userImageUrl } = useUser();

  const userSenderId = searchParams.get("userSenderId");
  const userTakerId = searchParams.get("userTakerId");
  const imageUrl = searchParams.get("imageUrl");
  const roomId = params.roomId as string;

  const [message, setMessage] = useState("");

  const messages = useQuery(api.ChatRooms.getMessagesByRoom, { roomId });
  const createMessage = useMutation(api.Messages.createMessage);

  if (!messages) return <Spinner loading={true} />;

  // const messages = [
  //   {
  //     id: 1,
  //     text: "Hey there! How's your project going?",
  //     sender: "user",
  //     time: "10:30 AM",
  //     read: true,
  //   },
  //   {
  //     id: 2,
  //     text: "It's going well! Just finished the UI design. What about you?",
  //     sender: "other",
  //     time: "10:32 AM",
  //     read: false,
  //   },
  //   {
  //     id: 3,
  //     text: "I'm working on the backend API. Almost done with the authentication system.",
  //     sender: "user",
  //     time: "10:33 AM",
  //     read: true,
  //   },
  //   {
  //     id: 4,
  //     text: "That's great! Let me know when you need me to integrate the frontend.",
  //     sender: "other",
  //     time: "10:35 AM",
  //     read: false,
  //   },
  //   {
  //     id: 5,
  //     text: "Sure, I'll probably finish by tomorrow. Then we can test everything together.",
  //     sender: "user",
  //     time: "10:36 AM",
  //     read: false,
  //   },
  // ];

  const handleSendMessage = async () => {
    if (!message) return;
    try {
      await createMessage({
        roomId: roomId!,
        senderId: userId!,
        content: message,
        replyToId: undefined,
        read: false,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="max-h-screen h-full p-4 flex justify-center items-start">
      <div className="w-full max-w-4xl bg-[#1A1D23] rounded-xl shadow-2xl overflow-hidden border border-gray-800 flex flex-col h-[85vh]">
        {/* Header/Navigation */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1A1D23]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                width={48}
                height={48}
                className="rounded-full border-2 border-orange-500 shadow-lg"
                src={imageUrl!}
                alt="logo"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1A1D23]"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-white font-semibold">Ali</span>
              <span className="text-green-400 text-sm flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                Online
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

        {/* Chat Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-900 to-[#1A1D23]">
          <div className="space-y-6">
            {/* Sample messages */}
            {messages.map((message) => (
              <div
                key={message._id}
                className={`flex ${message.senderId === userId ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex ${message.senderId === userId ? "flex-row-reverse" : "flex-row"} max-w-[75%] gap-3`}
                >
                  {/* User Avatar */}
                  <div className="flex-shrink-0">
                    <Image
                      width={40}
                      height={40}
                      className="rounded-full border-2 border-orange-500"
                      src={
                        message.senderId === userId ? userImageUrl! : imageUrl!
                      }
                      alt="User"
                    />
                  </div>

                  {/* Message Bubble */}
                  <div className="flex flex-col">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        message.senderId === userId
                          ? "bg-orange-500 text-white rounded-br-none"
                          : "bg-gray-700 text-white rounded-bl-none"
                      }`}
                    >
                      <p>{message.content}</p>
                    </div>
                    <div
                      className={`flex items-center mt-1 ${message.senderId === userId ? "justify-end" : "justify-start"}`}
                    >
                      <span className="text-xs text-gray-400 mr-1">
                        {formatDate(message._creationTime)}
                      </span>
                      {/* read indicator for user's messages only */}
                      {message.senderId === userId && (
                        <span
                          className={`text-xs ${message.read ? "text-blue-400" : "text-gray-500"}`}
                        >
                          {message.read ? "✓✓" : "✓"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Message Input Area */}
        <div className="p-4 border-t border-gray-800 bg-[#1A1D23]">
          <div className="flex items-center space-x-3">
            {/* Attachment Button */}
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
            </button>

            {/* Text Input */}
            <div className="flex-1 bg-gray-800 rounded-full px-4 py-2">
              <input
                type="text"
                placeholder="Type a message..."
                onChange={(e) => setMessage(e.target.value)}
                value={message}
                className="w-full bg-transparent text-white outline-none placeholder-gray-400"
              />
            </div>

            {/* Emoji Button */}
            <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
