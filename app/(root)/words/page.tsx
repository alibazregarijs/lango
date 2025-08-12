"use client";

import React, { useCallback, useEffect } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { useUser } from "@/context/UserContext";
import WordCarouselSlide from "@/components/WordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import useFetchWords from "@/hooks/useFetchWords";

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

  const { userId } = useUser();

  const { fetchWord } = useFetchWords({
    setLoading,
    setWords,
    userId: userId!,
  });

  const speak = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(words[slideIndex]?.word);
    synth.speak(utterance);
  }, [words, slideIndex]);

  useEffect(() => {
    fetchWord();
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [fetchWord]);

  return (
    <div className="flex-center w-full">
      <Carousel
        onNextClick={() => handleNext(fetchWord)}
        onPrevClick={handlePrev}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
        onStopClick={() => window.speechSynthesis.cancel()}
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
