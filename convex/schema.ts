import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  words: defineTable({
    userId: v.string(),
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
  essay: defineTable({
    essay: v.string(),
    level: v.string(),
    userId: v.string(),
    grade:v.optional(v.string()),
    grammer:v.optional(v.string()),
    suggestion:v.optional(v.string()),
  }),
});
