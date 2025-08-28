import Image from "next/image";
import { Combobox } from "./ComboBox";
import { formatDate } from "@/utils";
import { useChatData } from "@/hooks/useChats";
import { useChatQueries } from "@/hooks/useChats";
import { type MessageListProps, type MessageItemProps , type Message } from "@/types";

export const MessageList = ({ onActionSelect }: MessageListProps) => {
  const { userId, userImageUrl, imageUrl } = useChatData();
  const { messages } = useChatQueries();

  if (!messages) return null;

  return (
    <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-b from-gray-900 to-[#1A1D23]">
      <div className="space-y-6">
        {messages.map((message) => (
          <MessageItem
            key={message._id}
            message={message}
            userId={userId as string}
            userImageUrl={userImageUrl as string}
            imageUrl={imageUrl}
            onActionSelect={onActionSelect}
          />
        ))}
      </div>
    </div>
  );
};

const MessageItem = ({
  message,
  userId,
  userImageUrl,
  imageUrl,
  onActionSelect,
}: MessageItemProps) => {
  const isOwnMessage = message.senderId === userId;

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
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
};

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
