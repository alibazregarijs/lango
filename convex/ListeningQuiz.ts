import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createListeningQuizMutation = mutation({
  args: {
    userId: v.string(),
    level: v.string(),
    grade: v.optional(v.string()),
    sentence: v.string(),
    answer: v.optional(v.string()),
    disabled: v.optional(v.boolean()),
  },

  handler: async (ctx, args) => {
    const listening_quiz = await ctx.db.insert("ListeningQuiz", args);
    return listening_quiz;
  },
});

export const getRecentListeningQuizzes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const listening_quizzes = await ctx.db
      .query("ListeningQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(2);

    return listening_quizzes;
  },
});