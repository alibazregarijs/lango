import { internalMutation, mutation, query } from "./_generated/server";
import { ConvexError, v } from "convex/values";

export const getCurrentUserRecord = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), identity.subject))
      .unique();
    return user;
  },
});

export const getUserByClerkId = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();
  },
});

export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    imageUrl: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      imageUrl: args.imageUrl,
      name: args.name,
      lastSeen: Date.now(),
      online: true,
    });
  },
});
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.delete(user._id);
  },
});

export const updateUser = internalMutation({
  args: {
    clerkId: v.string(),
    imageUrl: v.string(),
    email: v.string(),
  },
  async handler(ctx, args) {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .unique();

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      imageUrl: args.imageUrl,
      email: args.email,
    });
  },
});

export const getUserTotalScore = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    // Sum grades from WordsQuiz
    const wordsDocs = await ctx.db
      .query("WordsQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    const wordsGrade = wordsDocs.reduce((sum, doc) => {
      const n = Number(doc.grade);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    // Sum grades from ListeningQuiz
    const listeningDocs = await ctx.db
      .query("ListeningQuiz")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();
    // If grade is stored as string, convert to number
    const listeningGrade = listeningDocs.reduce((sum, doc) => {
      const n = Number(doc.grade);
      return sum + (isNaN(n) ? 0 : n);
    }, 0);

    // Return the total score
    return wordsGrade + listeningGrade;
  },
});

export const updateUserImage = mutation({
  args: {
    clerkId: v.string(),
    newImageUrl: v.string(),
  },
  async handler(ctx, args) {
    // Find the user by clerkId using the index
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error("User not found for updating profile image");
    }

    // Update only the imageUrl field
    await ctx.db.patch(user._id, {
      imageUrl: args.newImageUrl,
    });

    console.log("updated ok");

    return { success: true };
  },
});

export const getTopPlayers = query({
  args: {},
  handler: async (ctx) => {
    // Get all users (or you might want to query only active users)
    const allUsers = await ctx.db.query("users").collect();

    // Calculate scores for each user
    const usersWithScores = await Promise.all(
      allUsers.map(async (user) => {
        // Sum grades from WordsQuiz for this user
        const wordsDocs = await ctx.db
          .query("WordsQuiz")
          .withIndex("by_userId", (q) => q.eq("userId", user.clerkId))
          .collect();
        const wordsScore = wordsDocs.reduce((sum, doc) => {
          const n = Number(doc.grade);
          return sum + (isNaN(n) ? 0 : n);
        }, 0);

        // Sum grades from ListeningQuiz for this user
        const listeningDocs = await ctx.db
          .query("ListeningQuiz")
          .withIndex("by_userId", (q) => q.eq("userId", user.clerkId))
          .collect();
        const listeningScore = listeningDocs.reduce((sum, doc) => {
          const n = Number(doc.grade);
          return sum + (isNaN(n) ? 0 : n);
        }, 0);

        return {
          userId: user.clerkId,
          gmail: user.email,
          username: user.name || "Anonymous",
          imageUrl: user.imageUrl,
          totalScore: wordsScore + listeningScore,
        };
      })
    );

    // Sort by totalScore in descending order and take top 3
    const topPlayers = usersWithScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .slice(0, 3);

    return topPlayers;
  },
});

export const getAllUsers = query({
  args: {}, // No arguments needed
  handler: async (ctx) => {
    // Get all users from the database
    const users = await ctx.db.query("users").collect();
    
    return users;
  },
});


export const updateUserStatus = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    imageUrl: v.string(),
    online: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        online: args.online,
        lastSeen: Date.now(),
        name: args.name,
        imageUrl: args.imageUrl,
      });
    } else {
      // Create new user
      await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        imageUrl: args.imageUrl,
        online: args.online,
        lastSeen: Date.now(),
      });
    }
  },
});

// Get all online users
export const getOnlineUsers = query({
  args: {},
  handler: async (ctx) => {
    const onlineUsers = await ctx.db
      .query("users")
      .withIndex("by_online", (q) => q.eq("online", true))
      .collect();

    return onlineUsers;
  },
});

export const getByUsername = query({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by username (case-sensitive exact match)
    const users = await ctx.db
      .query("users")
      .withIndex("by_name", (q) => q.eq("name", args.username))
      .collect();

    // Return the first user found (username should be unique)
    return users.length > 0 ? users[0] : null;
  },
});
