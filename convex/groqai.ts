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
    temperature: 0.9, // Increase randomness
    max_tokens: 300, // Limit response length to avoid verbosity
  });
}

export const EvaluateEssayAction = action({
  args: { essay: v.string(), level: v.string() },
  handler: async (_, args) => {
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

// for quiz

export const ListeningQuizAction = action({
  args: { level: v.string() },
  handler: async (_, args) => {
    const sentenceCompletion = await getGroqChatCompletion({
      prompt: `please give me one line random english sentence based on the level i give you . level : ${args.level}`,
    });

    const sentence = sentenceCompletion.choices[0]?.message?.content || "";
    return sentence;
  },
});

export const GiveGradeListeningAction = action({
  args: { answer: v.string(), sentence: v.string() },
  handler: async (_, args) => {
    const giveGradeListeningCompletion = await getGroqChatCompletion({
      prompt: `Rate the textual similarity of these two sentences I give you:

${args.sentence}

${args.answer}
If there’s no similarity, give a zero, and I only want the score, no extra explanation.`,
    });

    const grade =
      giveGradeListeningCompletion.choices[0]?.message?.content || "";
    return grade;
  },
});

export const QuizWordAction = action({
  args: { level: v.string() },
  handler: async (_, args) => {
    const QuizQuestionCompletion = await getGroqChatCompletion({
      prompt: `Create a fill-in-the-blank question designed for ${args.level} level to test grammar and vocabulary, with exactly one blank space in the sentence. Provide the question followed by four word options, where only one option is correct. Ensure the question is unique by focusing on a different grammatical concept (e.g., verb tense, prepositions, adjectives, adverbs, modals) or theme (e.g., travel, work, nature, education) than previous questions. Make it random and creative.`,
    });

    const question = QuizQuestionCompletion.choices[0]?.message?.content || "";

    const QuizCorrectWordCompletion = await getGroqChatCompletion({
      prompt: `${question} i want make a list from above plain text after A) until last item 
as json array like : 
[
{
 id:"book"
label:"Book"
}
]
just give only the array part , i want id be the label value with small character case and extract it like i told you exactly.`,
    });

    const CorrectWordCompletion = await getGroqChatCompletion({
      prompt: `${question} give me the correct word of this question , just give me the word . your choice must be in the four word in the question.`,
    });

    const wordsArray =
      QuizCorrectWordCompletion.choices[0]?.message?.content || "";

    const correctWord =
      CorrectWordCompletion.choices[0]?.message?.content || "";

    return [question, wordsArray, correctWord];
  },
});
