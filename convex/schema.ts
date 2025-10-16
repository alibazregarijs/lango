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
  })
    .index("by_userId_word", ["userId", "word"])
    .index("by_word", ["word"]) // <-- Added this line
    .searchIndex("search_word", { searchField: "word" }), // Only one search index

  users: defineTable({
    email: v.string(),
    imageUrl: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    lastSeen: v.number(), // Unix timestamp
    online: v.boolean(),
  })
    .index("by_clerkId", ["clerkId"])
    .index("by_online", ["online"]) // Add index for online status
    .index("by_name", ["name"]), // Add index for username

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
    .index("by_grade", ["grade"])
    .searchIndex("search_question", { searchField: "question" }),

  notifications: defineTable({
    userTakerId: v.string(),
    userSenderId: v.string(),
    userSenderImageUrl: v.optional(v.string()),
    userSenderName: v.optional(v.string()), // This is probably what you meant
    text: v.string(),
    read: v.optional(v.boolean()),
    accept: v.optional(v.boolean()),
    routeUrl: v.optional(v.string()),
  })
    .index("by_userTakerId", ["userTakerId"])
    .index("by_userSenderId", ["userSenderId"])
    .index("by_accept", ["accept"])
    .index("by_user_sender", ["userTakerId", "userSenderId"]) // Use userSenderId instead
    .searchIndex("search_text", { searchField: "text" }),

  // Chat Rooms table
  chatRooms: defineTable({
    takerId: v.string(), // User who initiates/receives
    giverId: v.string(), // User who provides/sends
    userSenderTyping: v.optional(v.boolean()), // Whether user is typing
    userTakerTyping: v.optional(v.boolean()), // Whether user is typing
  }).index("by_participants", ["takerId", "giverId"]),

  // Messages table
  messages: defineTable({
    roomId: v.string(),
    senderId: v.string(), // Who sent the message
    takerId: v.string(), // Who receives the message
    content: v.string(),
    replyToId: v.optional(v.id("messages")), // Reference to message being replied to
    read: v.boolean(),
  })
    .index("by_room", ["roomId"])
    .index("by_sender", ["senderId"])
    .index("by_reply_to", ["replyToId"]), // New index for efficient reply queries
});
