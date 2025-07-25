"use client";

// TODO : add type for words

import React, { useEffect } from "react";
import { CarouselDemo } from "@/components/Carousel";
import { useRef } from "react";
import axios from "axios";

export type wordProps = {
  audioDefinitionStorageId: string;
  user: string;
  definition: string;
  word: string;
  type: string;
  isSeen: boolean;
  audioWordUrl: string;
};

export type WordObjectProps = {
  definition: {
    definition: string;
    example: string;
  }[];
  word: string;
  type: {
    partOfSpeech: string;
  }[];
  audioWordUrl: {
    audio: string;
  }[];
  meaningCount: number;
}[];

const Word = () => {
  const slideIndexRef = useRef(0);
  const [words, setWords] = React.useState<any[]>([]);

  let wordObj: WordObjectProps = [
    {
      definition: [
        {
          definition: "",
          example: "",
        },
      ],
      word: "",
      type: [
        {
          partOfSpeech: "",
        },
      ],
      audioWordUrl: [
        {
          audio: "",
        },
      ],
      meaningCount: 0,
    },
  ];
  useEffect(() => {
    const fetchRandomWord = async () => {
      try {
        const response = await axios.get(
          "https://random-word-api.herokuapp.com/word?number=1"
        );

        const randomWordObj = await axios.get(
          `https://api.dictionaryapi.dev/api/v2/entries/en/run`
        );

        // console.log(randomWordObj.data[0], "word from api");
        const meaningCount = randomWordObj.data[0].meanings.length;
        randomWordObj.data[0].meanings.map(
          (
            item: {
              partOfSpeech: string;
              definitions: { definition: string; example: string }[];
            },
            index: number
          ) => {
            wordObj[words.length].type.push({
              partOfSpeech: item.partOfSpeech,
            });
            wordObj[words.length].definition.push({
              definition: item.definitions[0].definition,
              example: item.definitions[0]?.example,
            });
          }
        );

        randomWordObj.data[0].phonetics.map(
          (item: { audio: string }, index: number) => {
            wordObj[words.length].audioWordUrl.push({
              audio: item.audio,
            });
          }
        );

        wordObj[words.length].word = "beautiful";
        wordObj[words.length].meaningCount = meaningCount;
        console.log(wordObj,"alo")
        wordObj.push({
          definition: [
            {
              definition: "",
              example: "",
            },
          ],
          word: "",
          type: [
            {
              partOfSpeech: "",
            },
          ],
          audioWordUrl: [
            {
              audio: "",
            },
          ],
          meaningCount: 0,
        });

        setWords(wordObj);

        // const typeOfWord = randomWordObj.data[0].meanings[0].partOfSpeech;
      } catch (error) {
        console.error("Failed to fetch random word:", error);
      }
    };

    fetchRandomWord();
  }, []);

  const handleNextButton = () => {
    slideIndexRef.current += 1;

    if (slideIndexRef.current === words.length - 1) {
      words.pop();
      setWords((prevWords) => {
        // Check if we're at the end of the list
        const newWord: wordProps = {
          audioDefinitionStorageId: `${prevWords.length + 1}`,
          user: `${prevWords.length + 1}`,
          type: "noun",
          definition: `Definition ${prevWords.length + 1}`,
          word: `added Word ${prevWords.length + 1}`,
          isSeen: false,
          audioWordUrl: "https://www.example.com/audio.mp3",
        };
        return [...prevWords, newWord];
      });
    }
  };

  const handlePreviousButton = () => {
    slideIndexRef.current -= 1;
  };

  return (
    <div className="flex-center  custom-scrollbar w-full h-full">
      <CarouselDemo
        onNextClick={handleNextButton}
        onPrevClick={handlePreviousButton}
        words={words}
        slideIndex={slideIndexRef.current}
      />
    </div>
  );
};

export default Word;
