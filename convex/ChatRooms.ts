import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createChatRoom = mutation({
  args: {
    takerId: v.string(),
    giverId: v.string(),
  },
  handler: async (ctx, args) => {
    const { takerId, giverId } = args;

    // Create new chatroom
    const newRoomId = await ctx.db.insert("chatRooms", {
      takerId,
      giverId,
    });

    return await ctx.db.get(newRoomId);
  },
});

export const getMessagesByRoom = query({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", args.roomId))
      .order("asc")
      .collect();

    // Fetch reply information for messages that are replies
    const messagesWithReplies = await Promise.all(
      messages.map(async (message) => {
        if (message.replyToId) {
          const repliedMessage = await ctx.db.get(message.replyToId);
          return {
            ...message,
            replyToId: repliedMessage
              ? {
                  _id: repliedMessage._id ?? undefined,
                  content: repliedMessage.content ?? undefined,
                  senderId: repliedMessage.senderId ?? undefined,
                }
              : null,
          };
        }
        return message;
      })
    );

    return messagesWithReplies;
  },
});
