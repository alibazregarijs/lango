"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { type CarouselDemoProps } from "@/types";

function CarouselDemoComponent({
  onNextClick,
  onPrevClick,
  onStopClick,
  canGoNext,
  canGoPrev,
  children,
  className = "w-[70%] mt-4",
  contentClassName = "flex w-full flex-col ml-0!",
}: CarouselDemoProps) {
  return (
    <Carousel className={className}>
      <CarouselContent className={contentClassName}>{children}</CarouselContent>
      <div
        onClick={() => {
          onStopClick?.();
          onPrevClick();
        }}
      >
        <CarouselPrevious
          disabled={!canGoPrev}
          className="text-white hover:text-gray-200"
        />
      </div>
      <div
        onClick={() => {
          onStopClick?.();
          onNextClick();
        }}
      >
        <CarouselNext
          disabled={!canGoNext}
          className="text-white hover:text-gray-200"
        />
      </div>
    </Carousel>
  );
}

// 👇 Export memoized component
export const CarouselDemo = React.memo(CarouselDemoComponent);
