"use client";

import React, { useCallback, useEffect, startTransition } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import { type WordObject } from "@/types";
import { fetchRandomWord } from "@/index";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useUser } from "@/context/UserContext";
import WordCarouselSlide from "@/components/WordCarouselSlide";
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

  const speak = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(words[slideIndex]?.word);
    synth.speak(utterance);
  }, [words, slideIndex]);

  const handleCreateWords = useCallback(
    async ({ word }: { word: WordObject }) => {
      if (!userId) return;
      try {
        await createWordsMutation({
          ...word,
          userId,
        });
      } catch (error) {
        console.error("Failed to save word:", error);
      }
    },
    [userId, createWordsMutation]
  ); // save to db the words user have seen .

  const fetchWord = useCallback(async () => {
    startTransition(() => {
      setLoading(true);
    });
    try {
      const newWord = await fetchRandomWord({ setWords, setLoading });
      if (newWord) {
        await handleCreateWords({ word: newWord });
      }
    } catch (error) {
      console.error("Failed to fetch word:", error);
      setLoading(false);
    }
  }, [setWords, setLoading, handleCreateWords]);

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
