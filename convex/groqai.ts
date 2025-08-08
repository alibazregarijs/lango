import { action } from "./_generated/server";
import { v } from "convex/values";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function getGroqChatCompletion({ prompt }: { prompt: string }) {
  return groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content:
          "You are a creative English language teacher who generates unique and engaging sentences tailored to specific proficiency levels. Each sentence should vary in structure, theme, and linguistic focus to ensure diversity and avoid repetitive patterns.",
      },
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
      prompt: `Generate a single, unique English sentence designed for the ${args.level} level, ensuring appropriate grammar and vocabulary difficulty. The sentence should vary in structure (e.g., declarative, interrogative, or exclamatory), theme (e.g., daily life, nature, technology, education, or travel), and focus (e.g., verb usage, adjectives, or sentence complexity) to maximize diversity. Avoid repetition of common patterns and keep the sentence concise and engaging. in output just give the sentence not the explanation or prompt.`,
    });

    const sentence = sentenceCompletion.choices[0]?.message?.content || "";
    return sentence;
  },
});

export const GiveGradeListeningAction = action({
  args: { answer: v.string(), sentence: v.string() },
  handler: async (_, args) => {
    const giveGradeListeningCompletion = await getGroqChatCompletion({
      prompt: `1-${args.sentence}
2-${args.answer}

compare this two sentence word to word and give grade to it's similarity from one to ten. only give grade in the output.`,
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
