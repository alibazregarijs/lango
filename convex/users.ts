import { internalMutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getUserById = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    return user;
  },
});

export const createUser = internalMutation({
  args: {
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const { email, imageUrl, clerkId, name } = args;
    return await ctx.db.insert("users", { email, imageUrl, clerkId, name });
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
