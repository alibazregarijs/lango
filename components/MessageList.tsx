import Image from "next/image";
import React from "react";
import { Combobox } from "./ComboBox";
import { formatDate } from "@/utils";
import { useChatData } from "@/hooks/useChats";
import { useChatQueries } from "@/hooks/useChats";
import {
  type MessageListProps,
  type MessageItemProps,
  type Message,
} from "@/types";
import { useEffect, useRef, useCallback } from "react";
import { ArrowDown3 } from "iconsax-reactjs";

export const MessageList = ({
  onActionSelect,
  messagesEndRef,
  onMount,
  unReadMessageCount,
  onScroll,
}: MessageListProps) => {
  const { userId, userImageUrl, imageUrl } = useChatData();
  const { messages } = useChatQueries();
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    onMount(true);
  }, []);

  // Set up Intersection Observer to detect when last message is visible
  const lastMessageRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      if (node) {
        observerRef.current = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              onScroll(); // Run onScroll when last message becomes visible
            }
          },
          { threshold: 0.5 } // Trigger when 50% of the element is visible
        );

        observerRef.current.observe(node);
      }
    },
    [onScroll]
  );

  return (
    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-900 to-[#1A1D23]">
      <div className="space-y-6 relative">
        {messages?.map((message, index) => (
          <MessageItem
            key={message._id}
            message={message}
            userId={userId as string}
            userImageUrl={userImageUrl as string}
            imageUrl={imageUrl}
            onActionSelect={onActionSelect}
            // Only attach ref to the last message
            ref={index === messages.length - 1 ? lastMessageRef : undefined}
          />
        ))}

        {unReadMessageCount > 0 && (
          <div className="flex justify-center sticky bottom-4 z-10">
            <div
              onClick={onScroll}
              className="flex items-center cursor-pointer justify-center w-10 h-10 rounded-full bg-orange-500 border-2 border-white shadow-lg hover:bg-orange-600 transition-colors"
            >
              <span className="text-sm font-semibold text-white flex items-center">
                <ArrowDown3 size={24} />
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

// Forward ref to MessageItem component
const MessageItem = React.forwardRef<HTMLDivElement, MessageItemProps>(
  ({ message, userId, userImageUrl, imageUrl, onActionSelect }, ref) => {
    const isOwnMessage = message.senderId === userId;

    return (
      <div
        ref={ref} // Attach the ref here
        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`flex ${isOwnMessage ? "flex-row-reverse" : "flex-row"} max-w-[75%] gap-3`}
        >
          <div className="flex-shrink-0">
            <Image
              width={40}
              height={40}
              className="rounded-full border-2 border-orange-500"
              src={isOwnMessage ? userImageUrl : imageUrl || ""}
              alt="User"
            />
          </div>

          <div className="flex flex-col">
            <div
              className={`rounded-2xl px-4 py-2 ${
                isOwnMessage
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              {isOwnMessage ? (
                <Combobox
                  message={message.content}
                  messageId={message._id}
                  onActionSelect={onActionSelect}
                />
              ) : (
                <span>{message.content}</span>
              )}
            </div>
            <MessageFooter message={message} isOwnMessage={isOwnMessage} />
          </div>
        </div>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";

const MessageFooter = ({
  message,
  isOwnMessage,
}: {
  message: Message;
  isOwnMessage: boolean;
}) => (
  <div
    className={`flex items-center mt-1 ${isOwnMessage ? "justify-end" : "justify-start"}`}
  >
    <span className="text-xs text-gray-400 mr-1">
      {formatDate(message._creationTime)}
    </span>
    {isOwnMessage && (
      <span
        className={`text-xs ${message.read ? "text-blue-400" : "text-gray-500"}`}
      >
        {message.read ? "✓✓" : "✓"}
      </span>
    )}
  </div>
);
