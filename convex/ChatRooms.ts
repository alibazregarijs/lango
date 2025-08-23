import { mutation } from "./_generated/server";
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
