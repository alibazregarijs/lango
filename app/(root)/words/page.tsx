"use client";

import essentialWords from "@/words.json";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CarouselDemo } from "@/components/Carousel";

export type WordObject = {
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
};

const Word = () => {
  const slideIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const [words, setWords] = useState<WordObject[]>([]);

  const fetchRandomWord = async () => {
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

  useEffect(() => {
    fetchRandomWord(); // Fetch initial word
  }, []);

  const handleNextButton = () => {
    slideIndexRef.current += 1;

    // When reaching end, fetch new word
    if (slideIndexRef.current === words.length) {
      fetchRandomWord();
    } else {
      forceUpdate((prev) => prev + 1);
    }
  };

  const handlePreviousButton = () => {
    if (slideIndexRef.current > 0) {
      slideIndexRef.current -= 1;
      forceUpdate((prev) => prev + 1);
    }
  };

  return (
    <div className="flex-center custom-scrollbar w-full h-full">
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
