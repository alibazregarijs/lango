import { mutation } from "./_generated/server";
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