import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    userId: v.string(),
    username: v.optional(v.string()),
    text: v.string(),
    read: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Create notification with current timestamp
    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      username: args.username,
      text: args.text,
      read: args.read || false, // Default to unread
    });
    
    return notificationId;
  },
});