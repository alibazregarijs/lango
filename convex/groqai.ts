import { action } from "./_generated/server";
import { v } from "convex/values";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion({ prompt }: { prompt: string }) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    model: "llama-3.3-70b-versatile",
  });
}

export const EvaluateEssayAction = action({
  args: { essay: v.string(), level: v.string() },
  handler: async (_, args) => {
    console.log(args.essay,"essay");
    console.log(args.level,"level");
    const chatGradeCompletion = await getGroqChatCompletion({
      prompt: `give a grade to this paragraph based on ${args.level} level . (give me just a number)

essay

${args.essay}`,
    });

    const grade = chatGradeCompletion.choices[0]?.message?.content || "";

    const chatSuggestionCompletion = await getGroqChatCompletion({
      prompt: `give me suggestions for getting better in writing , this is my paragraph :${args.essay}. please your explanation be in 3 lines and don't use my paragraph in your explanation`,
    });

    const suggestion =
      chatSuggestionCompletion.choices[0]?.message?.content || "";

    const chatGrammerCompletion = await getGroqChatCompletion({
      prompt: `if this paragraph have problematic grammar fix it this is my paragraph :${args.essay}. please your explanation be in 3 lines and don't use my paragraph in your explanation`,
    });

    const grammer = chatGrammerCompletion.choices[0]?.message?.content || "";

 

    return [grade, grammer, suggestion];
  },
});
