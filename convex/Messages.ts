// convex/messages.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createMessage = mutation({
  args: {
    roomId: v.string(),
    senderId: v.string(),
    content: v.string(),
    replyToId: v.optional(v.string()),
    read: v.optional(v.boolean()), // Make optional with default
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      roomId: args.roomId,
      senderId: args.senderId,
      content: args.content,
      replyToId: args.replyToId,
      read: args.read ?? false, // Default to false if not provided
    });

    return messageId;
  },
});