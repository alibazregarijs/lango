"use client";

import React from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { fetchRandomWord } from "@/index";
import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUser } from "@/context/UserContext";
import { WordCarouselSlide } from "@/components/WordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";

const Word = () => {
  const {
    slideIndex,
    items: words,
    setItems: setWords,
    setLoading,
    loading,
    handleNext,
    handlePrev,
    canGoNext,
    canGoPrev,
  } = useCarousel<WordObject>();

  const createWordsMutation = useMutation(api.words.createWordMutation);
  const { userId } = useUser();

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(words[slideIndex]?.word);
    speechSynthesis.speak(utterance);
  };

  const handleCreateWords = async ({ word }: { word: WordObject }) => {
    if (!userId) return;
    await createWordsMutation({
      ...word,
      userId,
    });
  }; // saving word to db

  React.useEffect(() => {
    const fetchWord = async () => {
      const newWord = await fetchRandomWord({ setWords, setLoading });
      if (newWord) {
        handleCreateWords({ word: newWord });
      }
    };
    fetchWord();
  }, []); // fetching random word for the first time

  const handleFetchMore = async () => {
    const newWord = await fetchRandomWord({ setWords, setLoading });
    if (newWord) {
      handleCreateWords({ word: newWord });
    }
  }; // fetching random word when reaching the end of the list

  return (
    <div className="flex-center w-full">
      <Carousel
        onNextClick={() => handleNext(handleFetchMore)}
        onPrevClick={handlePrev}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      >
        <WordCarouselSlide
          words={words}
          slideIndex={slideIndex}
          loading={loading}
          speak={speak}
        />
      </Carousel>
    </div>
  );
};

export default Word;
