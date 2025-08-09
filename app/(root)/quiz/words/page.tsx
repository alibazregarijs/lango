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
import { useAction } from "convex/react";
import useFetchItems from "@/hooks/useFetchItems";
import { toast } from "sonner";
import { type CheckboxItemProps } from "@/types";

const MAX_RETRIES = 3; // Prevent infinite retries
const MAX_RESPONSE_RETRY = 2;

const page = () => {
  const [level, setLevel] = useState("pre_school");
  const retryCountRef = useRef(0); // Track retry attempts
  const retryResponseRef = useRef(0); // Reset retry count on successful fetch

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

    try {
      const res = await getQuizWordAction({ level });
      if (res) setLoading(false);

      let question: number | string = res[0];
      const index = question.indexOf("A)");
      question = res[0].slice(0, index);

      const correctWordResponse = res[2];
      const parsedItems = JSON.parse(res[1]);

      if (parsedItems.length !== 4) {
        retryCountRef.current += 1;

        if (retryCountRef.current < MAX_RETRIES) {
          toast.warning("Invalid data, retrying...");
          await handleQuizWord(); // Recursive retry
          return;
        } else {
          toast.error(
            "Failed after multiple attempts. Please try again later."
          );
          retryCountRef.current = 0; // Reset counter
          return;
        }
      }

      // Success case
      retryCountRef.current = 0; // Reset on success
      setWordItems((prev) => [...prev, [...parsedItems, { disabled: false }]]);
      setQuestion((prev) => [...prev, question]);
      setCorrectWord(correctWordResponse);
    } catch (error) {
      toast.error("An error occurred. Please try again.");
      setLoading(false);
    }
  }, [level, getQuizWordAction]);

  const handleSubmit = useCallback(
    (choosedWord: string) => {
      if (choosedWord.toLocaleLowerCase() === correctWord.toLocaleLowerCase()) {
        toast.success("Correct Answer!");
      } else {
        retryResponseRef.current += 1;
        toast.error("Wrong Answer!");
        if (retryResponseRef.current >= MAX_RESPONSE_RETRY) {
          setWordItems((prev) => {
            // Create a new copy of the previous state
            const newItems = [...prev];

            // Get the current slide's items
            const currentSlideItems = [...newItems[slideIndex]];

            // Modify the last item's `disabled` property
            const lastItemIndex = currentSlideItems.length - 1;
            
            currentSlideItems[lastItemIndex] = {
              ...currentSlideItems[lastItemIndex],
              disabled: true,
            };

            // Update the slide with the modified items
            newItems[slideIndex] = currentSlideItems;

            return newItems;
          });
          retryResponseRef.current = 0; // Reset counter
        }
      }
    },
    [correctWord, slideIndex]
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
        disabled={
          worditems[slideIndex]?.[worditems[slideIndex]?.length - 1]
            ?.disabled || false
        }
      />
    </CarouselDemo>
  );
};

export default page;
