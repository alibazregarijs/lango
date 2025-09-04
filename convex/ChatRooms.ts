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
      userSenderTyping: false,
      userTakerTyping: false,
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

// Public mutation with validators to update typing flags by roomId.
// convex/chatRooms.ts

// convex/chatRooms.ts

export const updateTyping = mutation({
  args: {
    takerId: v.string(),
    giverId: v.string(),
    userSenderTyping: v.optional(v.boolean()),
    userTakerTyping: v.optional(v.boolean()),
  },
  handler: async (
    ctx,
    { takerId, giverId, userSenderTyping, userTakerTyping }
  ) => {
    const room = await ctx.db
      .query("chatRooms")
      .withIndex("by_participants", (q) =>
        q.eq("takerId", takerId).eq("giverId", giverId)
      )
      .order("desc")
      .first();

    if (!room) return; // or throw new Error("Room not found");

    const patch: Partial<typeof room> = {};
    if (userSenderTyping !== undefined)
      patch.userSenderTyping = userSenderTyping;
    if (userTakerTyping !== undefined) patch.userTakerTyping = userTakerTyping;

    if (Object.keys(patch).length) {
      await ctx.db.patch(room._id, patch);
    }
  },
});
export const getChatRoom = query({
  args: {
    userTakerId: v.string(),
    userSenderId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chatRooms")
      .withIndex("by_participants", (q) =>
        q.eq("takerId", args.userTakerId).eq("giverId", args.userSenderId)
      )
      .order("desc")
      .first();
  },
});

export const deleteMessagesByRoom = mutation({
  args: { roomId: v.string() },
  handler: async (ctx, args) => {
    console.log("delete in convex")
    console.log(args.roomId,"roomid")
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_room", q => q.eq("roomId", args.roomId))
      .collect();
    for (const message of messages) {
      await ctx.db.delete(message._id);
    }
  },
});