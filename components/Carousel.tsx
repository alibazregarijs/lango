import * as React from "react";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export function CarouselDemo({
  onNextClick,
  onPrevClick,
  words,
  slideIndex,
}: {
  onNextClick: () => void;
  onPrevClick: () => void;
  words: any[];
  slideIndex: number;
}) {
  return (
    <Carousel className="md:w-2xl w-full max-h-full bg-[#15171C] border p-1 rounded-lg">
      <CarouselContent className="flex flex-col h-[70vh] overflow-y-scroll no-scrollbar">
        <div className="flex-center mt-4">
          <span className="text-medium font-semibold">
            Random<span className="text-orange-1 ml-2">Word</span>
          </span>
        </div>
        <CarouselItem>
          {Array.from({ length: words[slideIndex]?.meaningCount }).map(
            (_, index) => (
              <div
                key={index}
                className="flex flex-col h-[70vh] overflow-y-scroll no-scrollbar ml-2"
              >
                <div className="flex flex-col">
                  <div className="flex flex-col ml-4 space-y-1 flex-grow">
                    <span className="text-medium font-semibold capitalize">
                      {words[slideIndex]?.word}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-[12px] text-gray-400">
                        As a {words[slideIndex]?.type[index + 1]?.partOfSpeech}
                      </span>
                      <div className="mt-2 space-y-2 mb-4">
                        <p>
                          {words[slideIndex]?.definition[index + 1]?.definition}
                        </p>
                        {words[slideIndex]?.definition[index + 1]?.example && (
                          <p className="text-gray-400 text-[12px]">
                            {words[slideIndex]?.definition[index + 1]?.example}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex-center">
                    {words[slideIndex]?.audioWordUrl[index + 1]?.audio ? (
                      <audio controls>
                        <source
                          src={
                            words[slideIndex]?.audioWordUrl[index + 1]?.audio ||
                            undefined
                          }
                          type="audio/mpeg"
                        />
                        Your browser does not support the audio element.
                      </audio>
                    ):<span className="text-red-400 text-[12px]">No Audio</span>}
                  </div>
                </div>
              </div>
            )
          )}
        </CarouselItem>
      </CarouselContent>
      <div onClick={onPrevClick}>
        <CarouselPrevious className="text-white hover:text-gray-200" />
      </div>
      <div onClick={onNextClick}>
        <CarouselNext className="text-white hover:text-gray-200" />
      </div>
    </Carousel>
  );
}
