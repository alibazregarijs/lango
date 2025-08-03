"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselDemoProps {
  onNextClick: () => void;
  onPrevClick: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function CarouselDemo({
  onNextClick,
  onPrevClick,
  canGoNext,
  canGoPrev,
  children,
  className = "lg:w-2xl md:w-xl sm:w-[100vh] lsm:w-[60vh] max-h-full border p-1 rounded-lg",
  contentClassName = "flex w-full flex-col h-[70vh] overflow-y-scroll no-scrollbar ml-0!",
}: CarouselDemoProps) {
  return (
    <Carousel className={className}>
      <CarouselContent className={contentClassName}>{children}</CarouselContent>
      <div onClick={onPrevClick}>
        <CarouselPrevious
          disabled={!canGoPrev}
          className="text-white hover:text-gray-200"
        />
      </div>
      <div onClick={onNextClick}>
        <CarouselNext
          disabled={!canGoNext}
          className="text-white hover:text-gray-200"
        />
      </div>
    </Carousel>
  );
}
