import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createListeningQuizMutation = mutation({
  args: {
    userId: v.string(),
    level: v.string(),
    grade : v.optional(v.string()),
    sentence: v.string(),
    answer: v.optional(v.string())

  },
  
  handler: async (ctx, args) => {
    const listening_quiz = await ctx.db.insert("ListeningQuiz", args);
    return listening_quiz;
  },
});