"use client";
import { SelectDemo } from "@/components/Select";
import { useState, useEffect, useRef } from "react";
import QuizWordCarouselSlide from "@/components/QuizWordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { CarouselDemo } from "@/components/Carousel";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import useFetchItems from "@/hooks/useFetchItems";

export type CheckboxItemProps = {
  id: string;
  label: string;
};

const page = () => {
  const [level, setLevel] = useState("pre_school");
  const {
    slideIndex,
    setItems: setWordItems,
    loading,
    setLoading,
    handleNext,
    handlePrev,
    canGoPrev,
    canGoNext,
    items: worditems,
    slideIndexRef,
  } = useCarousel<any>();

  const [question, setQuestion] = useState<string[]>([]);
  const [_, setCorrectWord] = useState("");
  const hasMount = useRef(false);
  const getQuizWordAction = useAction(api.groqai.QuizWordAction);

  const handleQuizWord = async () => {
    setLoading(true);
    const res = await getQuizWordAction({ level });
    if (res) {
      setLoading(false);
    }
    let question: number | string = res[0];
    question = question.indexOf("A)");
    question = res[0].slice(0, question); // extract question
    const correctWord = res[2];
    setWordItems((prev) => {
      return [...prev, [...JSON.parse(res[1])]];
    }); // set word item for checkbox
    setQuestion((prev) => [...prev, question]);
    setCorrectWord(correctWord);
  };

  useFetchItems({ setLoading, slideIndexRef, handleFetchItems:handleQuizWord, level, hasMount , itemsLength: worditems.length});

  return (
    <CarouselDemo
      onNextClick={() => handleNext(handleQuizWord)}
      onPrevClick={() => handlePrev()}
      canGoNext={canGoNext}
      canGoPrev={canGoPrev}
    >
      <QuizWordCarouselSlide
        level={level}
        setLevel={setLevel}
        question={question[slideIndex]}
        items={worditems[slideIndex]}
        loading={loading}
      />
    </CarouselDemo>
  );
};

export default page;
