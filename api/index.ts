import axios from "axios";
import { WordObject } from "@/types";
import essentialWords from "@/words.json";

export const fetchRandomWord = async ({
  setWords,
}: {
  setWords: React.Dispatch<React.SetStateAction<WordObject[]>>;
}) => {
  try {
    const randomWord =
      essentialWords[Math.floor(Math.random() * essentialWords.length)];

    const apiWord = randomWord;
    const randomWordObj = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${apiWord}`
    );

    const apiData = randomWordObj.data[0];

    const newWord: WordObject = {
      word: apiWord,
      meaningCount: apiData.meanings.length || 0,
      definition: [],
      type: [],
      audioWordUrl: [],
    };

    apiData.meanings.forEach((item: any) => {
      newWord.type.push({ partOfSpeech: item.partOfSpeech });
      newWord.definition.push({
        definition: item.definitions[0]?.definition || "",
        example: item.definitions[0]?.example || "",
      });
    });

    apiData.phonetics.forEach((item: any) => {
      newWord.audioWordUrl.push({
        audio: item.audio || "",
      });
    });

    setWords((prev) => [...prev, newWord]);
  } catch (error) {
    console.error("Failed to fetch random word:", error);
  }
};
