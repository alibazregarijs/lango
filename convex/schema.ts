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
    grade: v.optional(v.string()),
    grammer: v.optional(v.string()),
    suggestion: v.optional(v.string()),
  }),

  ListeningQuiz: defineTable({
    level: v.string(),
    userId: v.string(),
    grade: v.optional(v.string()),
    sentence: v.string(),
    answer: v.optional(v.string()),
    disabled: v.optional(v.boolean()),
  })
    .index("by_userId", ["userId"])
    .searchIndex("search_sentence", { searchField: "sentence" }),

  WordsQuiz: defineTable({
    level: v.string(),
    userId: v.string(),
    isCorrect: v.optional(v.boolean()),
    correctWord: v.optional(v.string()),
    grade: v.optional(v.string()),
    question: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .searchIndex("search_question", { searchField: "question" }),
});
