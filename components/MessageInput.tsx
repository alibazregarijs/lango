import { type MessageInputProps } from "@/types";
import React, { memo } from "react";
import { X } from "lucide-react";
import { useChatState } from "@/context/ChatStateContext";
import { useScrollToBottom } from "@/app/(root)/chat/hooks/useScrollManagement";
import useUserTyping from "@/app/(root)/chat/hooks/useUserTyping";

export const MessageInput = memo(
  ({ onMessageChange, onSendMessage }: MessageInputProps) => {
    const {
      message,
      messageInputRef,
      replyedMessage,
      handleCancleReply: onCancelReply,
    } = useChatState();

    const { scrollToBottom: scrollOnSendMessage } = useScrollToBottom();

    return (
      <div className="p-4 border-t border-gray-800 bg-[#1A1D23]">
        {/* Reply message UI */}
        {replyedMessage[0] && (
          <div className="flex items-center justify-between mb-3 p-3 bg-gray-800 rounded-md border-l-4 border-orange-500">
            <div className="flex-1 min-w-0 mr-2">
              <div className="flex items-center text-xs text-orange-400 mb-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                  />
                </svg>
                Replying to {replyedMessage[0].userSenderName || "message"}
              </div>
              <p className="text-gray-300 text-sm truncate">
                {replyedMessage[0].content}
              </p>
            </div>
            {onCancelReply && (
              <button
                onClick={onCancelReply}
                className="flex-shrink-0 p-1 text-gray-400 hover:text-white rounded-full hover:bg-gray-700 transition-colors"
                aria-label="Cancel reply"
              >
                <X size={16} />
                {/* Using Lucide React X icon */}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center space-x-3">
          <AttachmentButton />
          <TextInput
            message={message}
            messageInputRef={
              messageInputRef as React.RefObject<HTMLInputElement>
            }
            onMessageChange={onMessageChange}
          />
          <EmojiButton />
          <SendButton
            onSendMessage={onSendMessage}
            scrollOnSendMessage={scrollOnSendMessage}
          />
        </div>
      </div>
    );
  }
);

MessageInput.displayName = "MessageInput";

const AttachmentButton = memo(() => (
  <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400 cursor-pointer"
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
));

AttachmentButton.displayName = "AttachmentButton";

const TextInput = memo(
  ({
    message,
    onMessageChange,
    messageInputRef,
  }: {
    message: string;
    onMessageChange: (value: string) => void;
    messageInputRef: React.RefObject<HTMLInputElement> | undefined;
  }) => {

    useUserTyping({ message }); // detect if user is typing

    return (
      <div className="flex-1 bg-gray-800 rounded-full px-4 py-2">
        <input
          type="text"
          placeholder="Type a message..."
          onChange={(e) => onMessageChange(e.target.value)}
          value={message}
          className="w-full bg-transparent text-white outline-none placeholder-gray-400"
          ref={messageInputRef}
        />
      </div>
    );
  }
);

TextInput.displayName = "TextInput";

const EmojiButton = memo(() => (
  <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5 text-gray-400 cursor-pointer"
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
));

EmojiButton.displayName = "EmojiButton";

const SendButton = memo(
  ({
    onSendMessage,
    scrollOnSendMessage,
  }: {
    onSendMessage: () => void;
    scrollOnSendMessage: () => void;
  }) => (
    <button
      onClick={() => {
        onSendMessage();
        setTimeout(scrollOnSendMessage, 400);
      }}
      className="p-2 rounded-full bg-orange-500 hover:bg-orange-600 transition-colors cursor-pointer"
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
  )
);

SendButton.displayName = "SendButton";
