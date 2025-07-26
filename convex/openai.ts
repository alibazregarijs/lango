import { action } from "./_generated/server";
import { v } from "convex/values";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const EvaluateEssayAction = action({
  args: { essay: v.string(), level: v.string() },
  handler: async (_, args) => {
    const { text: grade } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `give a grade to this paragraph based on ${args.level} level . (give me just a number)

essay :

${args.essay}`,
    });

    const { text: suggestion } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `give me suggestions for getting better in writing , this is my paragraph (give me 3 line suggestion , please be plain text without highlight) :${args.essay} `,
    });

    const { text: grammer } = await generateText({
      model: google("gemini-2.0-flash-001"),
      prompt: `if this paragraph have problematic grammar fix it if haven't any just give me "haven't any problematic grammar"value:${args.essay} `,
    });

    return [grade, suggestion, grammer];
  },
});
