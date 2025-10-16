"use client";
import {
  useState,
  useRef,
  useCallback,
  startTransition,
  useEffect,
} from "react";
import QuizWordCarouselSlide from "@/components/QuizWordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { CarouselDemo } from "@/components/Carousel";
import { api } from "@/convex/_generated/api";
import useFetchItems from "@/hooks/useFetchItems";
import { toast } from "sonner";
import { type CheckboxItemProps } from "@/types";
import useDisableWordsSlide from "@/hooks/useDisableWordsSlide";
import { useAction, useMutation, useQuery } from "convex/react";
import { useUser } from "@/context/UserContext";
import Spinner from "@/components/Spinner";

import {
  MAX_RETRIES,
  MAX_RESPONSE_RETRY,
  POSITIVE_GRADE,
  NEGATIVE_GRADE,
  MAX_WORDS_OPTION,
  ZERO_GRADE,
  LEVELS,
} from "@/constants";

type SchoolLevel =
  | "pre_school"
  | "elementary_school"
  | "middle_school"
  | "high_school"
  | "college";

const Page = () => {
  const { userId } = useUser();
  const retryCountRef = useRef(0);
  const retryResponseRef = useRef(0);
  const hasMount = useRef(false);

  const [question, setQuestion] = useState<string[]>([]);
  const [level, setLevel] = useState("pre_school");
  const [correctWord, setCorrectWord] = useState<string[]>([]);
  const [levels, setLevels] = useState<SchoolLevel[]>([]);

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

  const disableItem = useDisableWordsSlide({ setWordItems, slideIndex });
  const getQuizWordAction = useAction(api.groqai.QuizWordAction);
  const createWordsQuiz = useMutation(api.WordsQuiz.createWordsQuizMutation);
  const totalScore = useQuery(api.users.getUserTotalScore, { userId: userId! });

  const handleQuizWord = useCallback(async () => {
    startTransition(() => {
      setLoading(true);
    });

    try {
      const res = await getQuizWordAction({ level }); // getting the quiz word
      if (res) setLoading(false);

      let question: number | string = res[0];
      const index = question.indexOf("A)");
      question = res[0].slice(0, index);

      const correctWordResponse = res[2];
      const parsedItems = JSON.parse(res[1]);

      if (parsedItems.length !== MAX_WORDS_OPTION) {
        retryCountRef.current += 1;

        if (retryCountRef.current < MAX_RETRIES) {
          toast.warning("Invalid data, retrying...");
          await handleQuizWord();
          return;
        } else {
          toast.error(
            "Failed after multiple attempts. Please try again later."
          );
          retryCountRef.current = 0;
          return;
        }
      }

      retryCountRef.current = 0;
      setWordItems((prev) => [...prev, [...parsedItems, { disabled: false }]]);
      setQuestion((prev) => [...prev, question]);
      setCorrectWord((prev) => [...prev, correctWordResponse]);
      setLevels((prev) => {
        const prevItems = [...prev];
        return [...prevItems, level] as SchoolLevel[];
      });
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      console.error("Failed to fetch quiz word:", error);
      setLoading(false);
    }
  }, [level, getQuizWordAction, setLoading, setWordItems]);

  const handleSubmit = useCallback(
    async (choosedWord: string) => {
      if (
        choosedWord.toLocaleLowerCase() ===
        correctWord[slideIndex].toLocaleLowerCase()
      ) {
        toast.success("Correct Answer!");
        disableItem();
        try {
          await createWordsQuiz({
            userId: userId!,
            level: levels[slideIndex],
            grade: POSITIVE_GRADE,
            isCorrect: true,
            correctWord: correctWord[slideIndex],
            question: question[slideIndex],
          });
        } catch (error) {
          console.error("Failed to save quiz result:", error);
        }
      } else {
        retryResponseRef.current += 1;
        toast.error("Wrong Answer!");
        if (retryResponseRef.current >= MAX_RESPONSE_RETRY) {
          disableItem();
          try {
            await createWordsQuiz({
              userId: userId!,
              level: levels[slideIndex],
              grade: totalScore! > 0 ? NEGATIVE_GRADE : ZERO_GRADE,
              isCorrect: false,
              correctWord: correctWord[slideIndex],
              question: question[slideIndex],
            });
          } catch (error) {
            console.error("Failed to save quiz result:", error);
          }
          retryResponseRef.current = 0;
        }
      }
    },
    [
      correctWord,
      slideIndex,
      disableItem,
      level,
      question,
      userId,
      createWordsQuiz,
    ]
  );

  useEffect(() => {
    console.log(levels, "levelllll in useffect");
    console.log(question, "question");
  }, [levels]);

  useFetchItems({
    setLoading,
    slideIndexRef,
    handleFetchItems: handleQuizWord,
    level,
    hasMount,
    itemsLength: worditems.length,
  });

  if (!userId || totalScore === undefined) return <Spinner loading={true} />;

  return (
    <CarouselDemo
      onNextClick={() => handleNext(handleQuizWord)}
      onPrevClick={() => handlePrev()}
      canGoNext={canGoNext}
      canGoPrev={canGoPrev}
    >
      <QuizWordCarouselSlide
        key={worditems.length}
        level={levels[slideIndex]}
        setLevel={setLevel}
        question={question[slideIndex]}
        items={worditems[slideIndex]}
        loading={loading}
        handleSubmit={handleSubmit}
        disabled={
          worditems[slideIndex]?.[worditems[slideIndex]?.length - 1]
            ?.disabled || false
        }
      />
    </CarouselDemo>
  );
};

export default Page;
