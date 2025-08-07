"use client";
import { useState, useRef, useCallback, startTransition } from "react";
import QuizWordCarouselSlide from "@/components/QuizWordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { CarouselDemo } from "@/components/Carousel";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import useFetchItems from "@/hooks/useFetchItems";
import { toast } from "sonner";

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
  } = useCarousel<CheckboxItemProps[]>();

  const [question, setQuestion] = useState<string[]>([]);
  const [correctWord, setCorrectWord] = useState("");
  const hasMount = useRef(false);

  const getQuizWordAction = useAction(api.groqai.QuizWordAction);

  const handleQuizWord = useCallback(async () => {
    startTransition(() => {
      setLoading(true);
    });
    const res = await getQuizWordAction({ level });

    if (res) {
      setLoading(false);
    }

    let question: number | string = res[0];
    const index = question.indexOf("A)");
    question = res[0].slice(0, index); // extract question

    const correctWordResponse = res[2];

    setWordItems((prev) => [...prev, [...JSON.parse(res[1])]]);
    setQuestion((prev) => [...prev, question]);
    setCorrectWord(correctWordResponse);
  }, [level, getQuizWordAction]);

  const handleSubmit = useCallback(
    (choosedWord: string) => {
      if (choosedWord.toLocaleLowerCase() === correctWord.toLocaleLowerCase()) {
        toast.success("Correct Answer!");
      } else {
        toast.error("Wrong Answer!");
      }
    },
    [correctWord]
  );

  useFetchItems({
    setLoading,
    slideIndexRef,
    handleFetchItems: handleQuizWord,
    level,
    hasMount,
    itemsLength: worditems.length,
  });

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
        handleSubmit={handleSubmit}
      />
    </CarouselDemo>
  );
};

export default page;
