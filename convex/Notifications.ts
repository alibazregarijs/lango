import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userId: v.string(),
    userSenderName: v.string(),
    username: v.optional(v.string()),
    text: v.string(),
    read: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Use the correct compound index name
    const existingNotification = await ctx.db
      .query("notifications")
      .withIndex("by_user_sender", (q) =>
        q.eq("userId", args.userId).eq("userSenderName", args.userSenderName)
      )
      .first();

    if (existingNotification) {
      return false;
    }

    const notificationId = await ctx.db.insert("notifications", {
      userId: args.userId,
      userSenderName: args.userSenderName,
      username: args.username,
      text: args.text,
      read: args.read || false,
    });

    return true;
  },
});

export const getUnreadByUser = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .order("desc")
      .collect();
  },
});
