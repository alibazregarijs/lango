import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { query } from "./_generated/server";

export const createNotification = mutation({
  args: {
    userTakerId: v.string(),
    userSenderId: v.string(),
    userSenderImageUrl: v.optional(v.string()),
    userSenderName: v.optional(v.string()),
    text: v.string(),
    read: v.optional(v.boolean()),
    accept: v.optional(v.boolean()),
    routeUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Use the correct compound index name
    const existingNotification = await ctx.db
      .query("notifications")
      .withIndex("by_user_sender", (q) =>
        q.eq("userTakerId", args.userTakerId).eq("userSenderId", args.userSenderId)
      )
      .first();

    if (existingNotification) {
      return false;
    }

    await ctx.db.insert("notifications", {
      userTakerId: args.userTakerId,
      userSenderId: args.userSenderId,
      userSenderImageUrl: args.userSenderImageUrl,
      userSenderName: args.userSenderName,
      text: args.text,
      read: args.read || false,
      accept: args.accept || false,
      routeUrl: args.routeUrl,
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
      .withIndex("by_userTakerId", (q) => q.eq("userTakerId", args.userId))
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
      .withIndex("by_userTakerId", (q) => q.eq("userTakerId", args.userId))
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
