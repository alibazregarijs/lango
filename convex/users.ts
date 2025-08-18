import { internalMutation, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getCurrentUserRecord = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .unique();
    return user;
  },
});

export const getUserByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
    });
  },
});
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });
  },
});

export const getUserTotalScore = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Sum grades from WordsQuiz
    const wordsDocs = await ctx.db
      .query("WordsQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const wordsGrade = wordsDocs.reduce((sum, doc) => {
      const n = Number(doc.grade);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    // Sum grades from ListeningQuiz
    const listeningDocs = await ctx.db
      .query("ListeningQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    // If grade is stored as string, convert to number
    const listeningGrade = listeningDocs.reduce((sum, doc) => {
      const n = Number(doc.grade);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    // Return the total score
    return wordsGrade + listeningGrade;
  },
});

// convex/topPlayers.ts

// convex/users.ts

export const getUsers = query({
  args: {},
  handler: async (ctx) => {
    // Simply collect and return all users
    const users = await ctx.db.query("users").collect();
    return users;
  },
});

// In your convex/users.ts file (or similar)


export const updateUserImage = mutation({
  args: {
    clerkId: v.string(),
    newImageUrl: v.string(),
  },
  async handler(ctx, args) {
    // Find the user by clerkId using the index
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found");
    }

    // Update only the imageUrl field
    await ctx.db.patch(user._id, {
      imageUrl: args.newImageUrl,
    });

    return { success: true };
  },
});
