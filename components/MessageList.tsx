import Image from "next/image";
import React, { memo , useEffect, useRef } from "react";
import { Combobox } from "./ComboBox";
import { formatDate } from "@/utils";
import { useChatData } from "@/app/(root)/chat/hooks/useChatData";
import { ArrowDown3, ArrowLeft2 } from "iconsax-reactjs";
import {
  type MessageListProps,
  type MessageItemProps,
  type Message,
} from "@/types";
import { useScrollDetection } from "@/app/(root)/chat/hooks/useScrollManagement";
import { useChatState } from "@/context/ChatStateContext";
import useLastMessagDetection from "@/app/(root)/chat/hooks/useLastMessagDetection";

export const MessageList = memo(
  ({ onActionSelect, onMount, onScroll, messages }: MessageListProps) => {
    const { messagesEndRef } = useChatState();
    const { userId, userImageUrl, imageUrl } = useChatData();
    const { isAtBottom, setIsAtBottom } = useScrollDetection();
    const lastMessageRef = useLastMessagDetection({
      onScroll,
      setIsAtBottom,
    });

    useEffect(() => {
      onMount(true);
    }, [onMount]);

    return (
      <div className="flex-1 p-4 overflow-y-auto detect_scroll custom-scrollbar bg-gradient-to-b from-gray-900 to-[#1A1D23]">
        <div className="space-y-6 relative">
          {messages?.map((message, index) => (
            <React.Fragment key={message._id}>
              <MessageItem
                message={message}
                userId={userId as string}
                userImageUrl={userImageUrl as string}
                imageUrl={imageUrl}
                onActionSelect={onActionSelect}
                messagesEndRef={
                  messagesEndRef as React.RefObject<HTMLDivElement>
                }
                // Pass ref as a regular prop in React 19
                ref={index === messages.length - 1 ? lastMessageRef : undefined}
              />
              {index === messages.length - 1 && <div ref={messagesEndRef} />}
            </React.Fragment>
          ))}

          {!isAtBottom && (
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
        </div>
      </div>
    );
  }
);

MessageList.displayName = "MessageList";

// MessageItem component - ref is now a regular prop in React 19
const MessageItem = memo(
  ({
    message,
    userId,
    userImageUrl,
    imageUrl,
    onActionSelect,
    ref, // ref is now a regular prop
  }: MessageItemProps & { ref?: React.Ref<HTMLDivElement> }) => {
    const isOwnMessage = message.senderId === userId;
    console.log(message, "message");
    return (
      <div
        ref={ref} // Use ref directly as a prop
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
            {/* Reply Preview */}
            {message.replyToId && (
              <div
                className={`mb-1 ${isOwnMessage ? "text-right" : "text-left"}`}
              >
                <div className="inline-flex items-center bg-gray-800 rounded-lg px-3 py-1 border-l-2 border-orange-500">
                  <ArrowLeft2 size={14} className="text-orange-500 mr-1" />
                  <span className="text-xs text-gray-300 truncate max-w-[120px]">
                    {message.replyToId.content}
                  </span>
                </div>
              </div>
            )}

            <div
              className={`rounded-2xl px-4 py-2 ${
                isOwnMessage
                  ? "bg-orange-500 text-white rounded-br-none"
                  : "bg-gray-700 text-white rounded-bl-none"
              }`}
            >
              <Combobox
                message={message.content}
                messageId={message._id}
                onActionSelect={onActionSelect}
                isOwnMessage={isOwnMessage}
              />
            </div>
            <MessageFooter message={message} isOwnMessage={isOwnMessage} />
          </div>
        </div>
      </div>
    );
  }
);

MessageItem.displayName = "MessageItem";

const MessageFooter = memo(
  ({ message, isOwnMessage }: { message: Message; isOwnMessage: boolean }) => (
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
  )
);

MessageFooter.displayName = "MessageFooter";
