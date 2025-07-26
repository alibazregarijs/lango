"use client";

import React, { useEffect, useRef, useState } from "react";
import { CarouselDemo } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { fetchRandomWord } from "@/api";

const Word = () => {
  const slideIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const [words, setWords] = useState<WordObject[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchRandomWord({ setWords , setLoading }); // Fetch initial word
  }, []);

  const handleNextButton = () => {
    slideIndexRef.current += 1;

    // When reaching end, fetch new word
    if (slideIndexRef.current === words.length) {
      setLoading(true);
      fetchRandomWord({ setWords , setLoading });
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
        loading={loading}
      />
    </div>
  );
};

export default Word;
