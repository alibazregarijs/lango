"use client";

import React, { useEffect, useRef, useState } from "react";
import { CarouselDemo } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { fetchRandomWord } from "@/index";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@/context/UserContext";

const Word = () => {
  const slideIndexRef = useRef(0);
  const [, forceUpdate] = useState(0);
  const [words, setWords] = useState<WordObject[]>([]);
  const [loading, setLoading] = useState(false);
  const createWordsMutation = useMutation(api.words.createWordMutation);
  const { userId } = useUser();

  const handleCreateWords = async ({ word }: { word: WordObject }) => {
    if (!userId) return;
    await createWordsMutation({
      ...word,
      userId,
    });
  };

  useEffect(() => {
    const fetchWord = async () => {
      setLoading(true);
      const newWord = await fetchRandomWord({ setWords, setLoading }); // Fetch initial word
      if (newWord) {
        handleCreateWords({ word: newWord });
      }
    };
    fetchWord();
  }, []);
  const handleNextButton = () => {
    slideIndexRef.current += 1;

    // When reaching end, fetch new word
    if (slideIndexRef.current === words.length) {
      const fetchWord = async () => {
        setLoading(true);
        const newWord = await fetchRandomWord({ setWords, setLoading }); // Fetch initial word
        if (newWord) {
          handleCreateWords({ word: newWord });
        }
      };
      fetchWord();
    } else {
      forceUpdate((prev) => prev + 1);
    }
  };

  const handlePreviousButton = () => {
    // TODO : test if prev button show first slide
    console.log(slideIndexRef.current, "slide index");

    if (slideIndexRef.current > 0) {
      slideIndexRef.current -= 1;
      forceUpdate((prev) => prev + 1);
    }
  };

  return (
    <div className="flex-center w-full h-full">
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
