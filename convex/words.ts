import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createWordMutation = mutation({
  args: {
    userId: v.string(),
    definition: v.optional(v.array(
      v.object({
        definition: v.string(),
        example: v.string(),
      })
    )),
    word: v.string(),
    type: v.optional(v.array(
      v.object({
        partOfSpeech: v.string(),
      })
    )),
    audioWordUrl: v.optional(v.array(
      v.object({
        audio: v.string(),
      })
    )),
    meaningCount: v.number(),
  },
  
  handler: async (ctx, args) => {
    const wordId = await ctx.db.insert("words", args);
    return wordId;
  },
});

export const getUserWordsQuery = query({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const words = await ctx.db
      .query("words")
      .withIndex("by_userId_word", (q) => q.eq("userId", args.userId))
      .order("desc")
      .collect();

    return words;
  },
});

export const getWordObjectQuery = query({
  args: {
    userId: v.string(),
    word: v.string(),
  },
  handler: async (ctx, args) => {
    const word = await ctx.db
      .query("words")
      .withIndex("by_userId_word", q =>
        q.eq("userId", args.userId).eq("word", args.word)
      )
      .collect();

    return word;
  },
});