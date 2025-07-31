"use client";

import React, { useEffect, useState, useRef } from "react";
import { CarouselDemo as Carousel } from "@/components/Carousel";
import ListeningCarouselSlide from "@/components/ListeningCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@/context/UserContext";
import { Modal } from "@/components/Modal";
import { toast } from "sonner";
import { type SentenceObjectProps } from "@/types/index";
import { checkNull } from "@/utils/index";

const page = () => {
  const [level, setLevel] = useState("pre_school");
  const [answer, setAnswer] = useState("");
  const hasMount = useRef(false);
  const [open, setOpen] = useState(false);

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
  const { userId } = useUser();
  const sentenceObjectRef = React.useRef<SentenceObjectProps>({
    userId: "",
    level: "",
    grade: "",
    sentence: "",
    answer: "",
  });

  const getListeningQuizAction = useAction(api.groqai.ListeningQuizAction); // get sentence
  const getGradeQuizAction = useAction(api.groqai.GiveGradeListening); // get grade based on sentence
  const createListeningQuiz = useMutation(
    api.ListeningQuiz.createListeningQuizMutation
  ); // save our data to listening quiz table

  const handleCreateListeningQuiz = async (
    listeningQuizObj: SentenceObjectProps
  ) => {
    const res = await createListeningQuiz(listeningQuizObj);
    return res;
  }; // function that handle saving quiz data into convex db

  const handleIconClick = () => {
    const utterance = new SpeechSynthesisUtterance(
      items[slideIndex]?.sentence || ""
    );
    speechSynthesis.speak(utterance);
  }; // make sentence speak !

  const handleSubmit = () => {
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
      sentenceObjectRef.current.level = level;

      const currentItem = items[slideIndex];
      setItems((prevItems) => {
        const newItems = [...prevItems];
        newItems[slideIndex] = {
          ...currentItem,
          answer: answer,
          grade: grade,
          level: level,
        };
        return newItems;
      });

      const listeningQuizObj: SentenceObjectProps = {
        userId: userId!,
        answer: answer,
        grade: grade,
        level: level,
        sentence: currentItem.sentence,
      }; // this object will be saved in convex db

      const openModal = handleCreateListeningQuiz(listeningQuizObj);
      if ((await openModal) && openModal instanceof Promise) {
        setOpen(true);
      }
    };
    handleGetGradeQuizAction();
  }; // get current item and save in convex db

  const fetchSentence = async () => {
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
        },
      ];
      return newItem;
    });
  }; // fetch more sentence

  useEffect(() => {
    if (hasMount.current) {
      const run = async () => {
        setLoading(true);
        slideIndexRef.current += 1;
        await fetchSentence();
        setLoading(false);
      };

      run();
    } else {
      hasMount.current = true;
    }
  }, [level]); // for getting new sentence if user change level

  useEffect(() => {
    hasMount.current = true;
    fetchSentence();
  }, []); // fetch sentence on first mount up

  return (
    <>
      <Carousel
        onNextClick={() => handleNext(fetchSentence)}
        onPrevClick={() => handlePrev()}
        canGoNext={canGoNext}
        canGoPrev={canGoPrev}
      >
        <ListeningCarouselSlide
          handleIconClick={handleIconClick}
          level={level}
          setLevel={setLevel}
          onSubmit={handleSubmit}
          setAnswer={setAnswer}
          loading={loading}
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
    </>
  );
};

export default page;
