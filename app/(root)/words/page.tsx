"use client";
import React, { useEffect, useRef } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { useUser } from "@/context/UserContext";
import WordCarouselSlide from "@/components/WordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import useFetchWords from "@/hooks/useFetchWords";
import useSpeek from "@/hooks/useSpeek";
import Spinner from "@/components/Spinner";

const Word = () => {
  const { userId } = useUser();
  const hasFetchedRef = useRef(false);

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
  const { fetchWord } = useFetchWords({
    setLoading,
    setWords,
    userId: userId!,
  });

  useEffect(() => {
    if (!hasFetchedRef.current && userId) {
      fetchWord();
      hasFetchedRef.current = true;
    }
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [fetchWord, userId]);

  if (!userId) return <Spinner loading={true} />;

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