import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  words: defineTable({
    definition: v.optional(
      v.array(
        v.object({
          definition: v.string(),
          example: v.string(),
        })
      )
    ),
    word: v.string(),
    type: v.optional(
      v.array(
        v.object({
          partOfSpeech: v.string(),
        })
      )
    ),
    audioWordUrl: v.optional(
      v.array(
        v.object({
          audio: v.string(),
        })
      )
    ),
    meaningCount: v.number(),
  }).searchIndex("search_word", { searchField: "word" }),

  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.string(),
  }),
});
