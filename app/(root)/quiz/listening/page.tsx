"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import ListeningCarouselSlide from "@/components/ListeningCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/context/UserContext";
import { Modal } from "@/components/Modal";
import { type SentenceObjectProps } from "@/types/index";
import { checkNull } from "@/utils/index";
import useFetchItems from "@/hooks/useFetchItems";
import useDebounce from "@/hooks/useDebounce";

const page = () => {
  const {
    slideIndex,
    setItems,
    loading,
    setLoading,
    handleNext,
    handlePrev,
    canGoPrev,
    canGoNext,
    items,
    slideIndexRef,
  } = useCarousel<SentenceObjectProps>();

  const [level, setLevel] = useState("pre_school");
  const [answer, setAnswer] = useState("");
  const hasMount = useRef(false);
  const [open, setOpen] = useState(false);

  const { userId } = useUser();
  const sentenceObjectRef = React.useRef<SentenceObjectProps>({
    userId: "",
    level: "",
    grade: "",
    sentence: "",
    answer: "",
    disabled: false,
  });

  const getListeningQuizAction = useAction(api.groqai.ListeningQuizAction); // get sentence
  const getGradeQuizAction = useAction(api.groqai.GiveGradeListeningAction); // get grade based on sentence
  const createListeningQuiz = useMutation(
    api.ListeningQuiz.createListeningQuizMutation
  ); // save our data to listening quiz table

  const handleCreateListeningQuiz = async (
    listeningQuizObj: SentenceObjectProps
  ) => {
    const res = await createListeningQuiz(listeningQuizObj);
    return res;
  }; // function that handle saving quiz data into convex db

  const handleIconClick = useCallback(() => {
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(
      items[slideIndex]?.sentence || ""
    );
    synth.speak(utterance);
  }, [items, slideIndex]); // play current sentence

  const debouncedSpeek = useDebounce({
    callback: handleIconClick,
    delay: 300,
  });

  const handleSubmit = () => {
    window.speechSynthesis.cancel();
    try {
      const isTextNull = checkNull(
        answer,
        <span className="text-gray-400">Please write something.</span>
      ); // check if answer not to be null.
      if (!isTextNull) {
        return;
      }
      const handleGetGradeQuizAction = async () => {
        const grade = await getGradeQuizAction({
          answer: answer,
          sentence: sentenceObjectRef.current.sentence,
        });

        sentenceObjectRef.current.answer = answer;
        sentenceObjectRef.current.grade = grade;
        sentenceObjectRef.current.level = items[slideIndexRef.current]?.level;

        const currentItem = items[slideIndex];
        setItems((prevItems) => {
          const newItems = [...prevItems];
          newItems[slideIndex] = {
            ...currentItem,
            answer: answer,
            grade: grade,
            level: items[slideIndexRef.current]?.level,
          };
          return newItems;
        });

        const listeningQuizObj: SentenceObjectProps = {
          userId: userId!,
          answer: answer,
          grade: grade,
          level: items[slideIndexRef.current]?.level,
          sentence: currentItem.sentence,
          disabled: false,
        }; // this object will be saved in convex db

        const openModal = handleCreateListeningQuiz(listeningQuizObj);
        if ((await openModal) && openModal instanceof Promise) {
          setOpen(true);
        }
      };
      handleGetGradeQuizAction();
    } catch (error) {
      console.error("Failed to save quiz result:", error);
    }
  }; // get current item and save in convex db

  const fetchSentence = useCallback(async () => {
    const sentence = await getListeningQuizAction({ level });

    sentenceObjectRef.current.sentence = sentence;
    sentenceObjectRef.current.userId = userId!;

    setItems((prev) => {
      const newItem = [
        ...prev,
        {
          userId: userId!,
          level,
          grade: "",
          sentence: sentence,
          answer: "",
          disabled: false,
        },
      ];
      return newItem;
    });
  }, [getListeningQuizAction, level, userId, setItems, sentenceObjectRef]);

  useEffect(() => {
    if (!open && hasMount.current) {
      setAnswer("");
      setItems((prev) => {
        const updated = [...prev];
        updated[slideIndexRef.current] = {
          ...updated[slideIndexRef.current],
          disabled: true,
        };
        return updated;
      });
    }
  }, [open]);

  useFetchItems({
    setLoading,
    slideIndexRef,
    handleFetchItems: fetchSentence,
    level,
    hasMount,
    itemsLength: items.length,
  });

  return (
    <div className="flex-center w-full">
      <Carousel
        onNextClick={() => handleNext(fetchSentence)}
        onPrevClick={() => handlePrev()}
        onStopClick={() => window.speechSynthesis.cancel()}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      >
        <ListeningCarouselSlide
          handleIconClick={debouncedSpeek}
          level={items[slideIndexRef.current]?.level || "pre_school"}
          setLevel={setLevel}
          onSubmit={handleSubmit}
          setAnswer={setAnswer}
          loading={loading}
          answer={answer}
          disabled={items[slideIndex]?.disabled || false}
        />
      </Carousel>
      <Modal open={open} onOpenChange={setOpen}>
        <Modal.Content>
          <Modal.Section title="Pay attention to this point." loading={loading}>
            <Modal.Body label="Sentence got played">
              {items[slideIndex]?.sentence}
            </Modal.Body>
            <Modal.Body label="Grade">{items[slideIndex]?.grade}</Modal.Body>
            <Modal.Body label="Your response">
              {items[slideIndex]?.answer}
            </Modal.Body>
          </Modal.Section>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default page;
