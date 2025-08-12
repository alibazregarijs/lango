"use client";
import React, { useCallback, useEffect } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { useUser } from "@/context/UserContext";
import WordCarouselSlide from "@/components/WordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import useFetchWords from "@/hooks/useFetchWords";
import useSpeek from "@/hooks/useSpeek";

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

  const { speak } = useSpeek({ text: words[slideIndex]?.word, slideIndex });

  const { userId } = useUser();

  const { fetchWord } = useFetchWords({
    setLoading,
    setWords,
    userId: userId!,
  });

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
