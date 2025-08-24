import { mutation , query } from "./_generated/server";
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
      .order("asc") // or "desc" for reverse chronological order
      .collect();

    return messages;
  },
});