import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createEssayMutation = mutation({
  args: {
    userId: v.string(),
    essay: v.string(),
    level: v.string(),
    grade:v.optional(v.string()),
    grammer:v.optional(v.string()),
    suggestion:v.optional(v.string()),
  },
  
  handler: async (ctx, args) => {
    const essay = await ctx.db.insert("essay", args);
    return essay;
  },
});