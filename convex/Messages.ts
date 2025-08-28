// convex/messages.ts
import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createMessage = mutation({
  args: {
    roomId: v.string(),
    senderId: v.string(),
    takerId: v.string(),
    content: v.string(),
    replyToId: v.optional(v.string()),
    read: v.optional(v.boolean()), // Make optional with default
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      roomId: args.roomId,
      senderId: args.senderId,
      takerId: args.takerId,
      content: args.content,
      replyToId: args.replyToId,
      read: args.read ?? false, // Default to false if not provided
    });

    return messageId;
  },
});

export const deleteMessage = mutation({
  args: {
    messageId: v.id("messages"),
  },
  handler: async (ctx, args) => {
    // Delete the specific message by its ID
    await ctx.db.delete(args.messageId);
  },
});

export const updateMessage = mutation({
  args: {
    messageId: v.id("messages"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    // Update the specific message by its ID
    await ctx.db.patch(args.messageId, { content: args.content });
  },
});


export const markSenderMessagesInRoom = mutation({
  args: {
    roomId: v.string(),
    senderId: v.string(),
    readStatus: v.boolean(),
  },
  handler: async (ctx, args) => {
    const { roomId, senderId, readStatus } = args;

    // Get all messages from this sender in the room using the 'by_room' index
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", (q) => q.eq("roomId", roomId))
      .filter((q) => q.eq(q.field("senderId"), senderId))
      .collect();

    // Update each message's read status
    for (const message of messages) {
      await ctx.db.patch(message._id, { read: readStatus });
    }

    return { success: true, updatedCount: messages.length };
  },
});