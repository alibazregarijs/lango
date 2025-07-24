"use client";

import React from "react";
import { CarouselDemo } from "@/components/Carousel";

export type wordProps = {
  audioDefinitionStorageId: string;
  user: string;
  definition: string;
  word: string;
  isSeen: boolean;
  audioWordUrl: string;
};

const Word = () => {
  const [slideIndex, setSlideIndex] = React.useState(0);
  const [words, setWords] = React.useState<wordProps[]>([
    {
      audioDefinitionStorageId: "1",
      user: "1",
      definition: "Definition 1",
      word: "Word 1",
      isSeen: false,
      audioWordUrl: "https://www.example.com/audio.mp3",
    },
    {
      audioDefinitionStorageId: "2",
      user: "2",
      definition: "Definition 2",
      word: "Word 2",
      isSeen: false,
      audioWordUrl: "https://www.example.com/audio.mp3",
    },
  ]);

  const handleNextButton = () => {
    setSlideIndex((prevIndex) => prevIndex + 1);
  };

  const handlePreviousButton = () => {
    setSlideIndex((prevIndex) => prevIndex - 1);
  };

  return (
    <div className="flex-center h-full">
      <CarouselDemo onNextClick={handleNextButton} onPrevClick={handlePreviousButton} word={words[slideIndex]} />
    </div>
  );
};

export default Word;
