import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createWordsQuizMutation = mutation({
  args: {
    level: v.string(),
    userId: v.string(),
    isCorrect: v.optional(v.boolean()),
    grade: v.optional(v.number()),
    question: v.optional(v.string()),
  },

  handler: async (ctx, args) => {
    const words_quiz = await ctx.db.insert("WordsQuiz", args);
    return words_quiz;
  },
});
