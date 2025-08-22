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
    accept: v.optional(v.boolean()),
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

export const markNotificationsAsRead = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Get all unread notifications for the user
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("read"), false))
      .collect();

    // Update each notification to mark as read
    for (const notification of notifications) {
      await ctx.db.patch(notification._id, { read: true });
    }

    return notifications.length; // Return count of updated notifications
  },
});

export const acceptNotificationById = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    // Update the specific notification by ID
    await ctx.db.patch(args.notificationId, {
      accept: true,
    });

    return { success: true };
  },
});

export const markAsRead = mutation({
  args: {
    notificationId: v.id("notifications"),
  },
  handler: async (ctx, args) => {
    // Update the specific notification by ID to set read as true
    await ctx.db.patch(args.notificationId, {
      read: true,
    });

    return { success: true };
  },
});
