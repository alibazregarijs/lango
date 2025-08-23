import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOrCreateChatRoom = mutation({
  args: {
    takerId: v.id("users"),
    giverId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { takerId, giverId } = args;

    // Check for existing chatrooms first
    const existingRooms = await ctx.db
      .query("chatRooms")
      .withIndex("by_participants", (q) => 
        q.eq("takerId", takerId).eq("giverId", giverId)
      )
      .order("desc")
      .first();

    if (existingRooms) {
      return existingRooms;
    }

    // Create new chatroom if none exists
    const newRoomId = await ctx.db.insert("chatRooms", {
      takerId,
      giverId,
    });

    return await ctx.db.get(newRoomId);
  },
});