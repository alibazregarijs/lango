import { type MessageInputProps } from "@/types";
import { memo } from "react";

export const MessageInput = memo(
  ({
    message,
    onMessageChange,
    onSendMessage,
    scrollOnSendMessage,
  }: MessageInputProps) => {
    return (
      <div className="p-4 border-t border-gray-800 bg-[#1A1D23]">
        <div className="flex items-center space-x-3">
          <AttachmentButton />
          <TextInput message={message} onMessageChange={onMessageChange} />
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
  }: {
    message: string;
    onMessageChange: (value: string) => void;
  }) => (
    <div className="flex-1 bg-gray-800 rounded-full px-4 py-2">
      <input
        type="text"
        placeholder="Type a message..."
        onChange={(e) => onMessageChange(e.target.value)}
        value={message}
        className="w-full bg-transparent text-white outline-none placeholder-gray-400"
      />
    </div>
  )
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
