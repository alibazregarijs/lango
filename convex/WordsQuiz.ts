import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWordsQuizMutation = mutation({
  args: {
    level: v.string(),
    userId: v.string(),
    isCorrect: v.optional(v.boolean()),
    correctWord: v.optional(v.string()),
    grade: v.optional(v.string()),
    question: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const words_quiz = await ctx.db.insert("WordsQuiz", args);
    return words_quiz;
  },
});

export const getRecentListeningQuizzes = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const words_quizzes = await ctx.db
      .query("WordsQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .take(2);

    return words_quizzes;
  },
});