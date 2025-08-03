"use client";
import { SelectDemo } from "@/components/Select";
import { useState } from "react";
import QuizWordCarouselSlide from "@/components/QuizWordCarouselSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { CarouselDemo } from "@/components/Carousel";

const page = () => {
  const [level, setLevel] = useState("pre_school");
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
  } = useCarousel<any>();

  const fetchSentence = async () => {
    console.log("fetchSentence");
  };
  return (
    <CarouselDemo
      onNextClick={() => handleNext(fetchSentence)}
      onPrevClick={() => handlePrev()}
      canGoNext={canGoNext}
      canGoPrev={canGoPrev}
    >
      <QuizWordCarouselSlide level={level} setLevel={setLevel} />;
    </CarouselDemo>
  );
};

export default page;
