"use client";

import React, { useEffect, useRef, useState } from "react";
import { CarouselDemo } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { fetchRandomWord } from "@/api";

const Word = () => {
  const slideIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const [words, setWords] = useState<WordObject[]>([]);

  useEffect(() => {
    fetchRandomWord({ setWords }); // Fetch initial word
  }, []);

  const handleNextButton = () => {
    slideIndexRef.current += 1;

    // When reaching end, fetch new word
    if (slideIndexRef.current === words.length) {
      fetchRandomWord({ setWords });
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
