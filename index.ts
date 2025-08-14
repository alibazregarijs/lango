import axios from "axios";
import { WordObject } from "@/types";
import essentialWords from "@/words.json";

type ApiMeaning = {
  partOfSpeech: string;
  definitions: {
    definition?: string;
    example?: string;
  }[];
};

type ApiPhonetic = {
  audio?: string;
};

type ApiResponse = {
  meanings: ApiMeaning[];
  phonetics: ApiPhonetic[];
};

export const fetchRandomWord = async ({
  setWords,
  setLoading,
  word,
}: {
  setWords: React.Dispatch<React.SetStateAction<WordObject[]>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  word?: string;
}) => {
  try {
    setLoading(true);

    const randomWord =
      essentialWords[Math.floor(Math.random() * essentialWords.length)];

    const selectedWord = word || randomWord;

    const { data } = await axios.get<ApiResponse[]>(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${selectedWord}`
    );

    const apiData = data[0];

    const newWord: WordObject = {
      word: selectedWord,
      meaningCount: apiData.meanings.length,
      definition: [],
      type: [],
      audioWordUrl: [],
    };

    apiData.meanings.forEach((item) => {
      newWord.type.push({ partOfSpeech: item.partOfSpeech });
      newWord.definition.push({
        definition: item.definitions[0]?.definition || "",
        example: item.definitions[0]?.example || "",
      });
    });

    apiData.phonetics.forEach((item) => {
      newWord.audioWordUrl.push({
        audio: item.audio || "",
      });
    });

    setWords((prev) => [...prev, newWord]);
    return newWord;
  } catch (error) {
    console.error("Failed to fetch random word:", error);
  } finally {
    setLoading(false);
  }
};
