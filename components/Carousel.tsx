import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { WordObject } from "@/types";

export function CarouselDemo({
  onNextClick,
  onPrevClick,
  words,
  slideIndex,
}: {
  onNextClick: () => void;
  onPrevClick: () => void;
  words: WordObject[];
  slideIndex: number;
}) {
  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(words[slideIndex]?.word);
    speechSynthesis.speak(utterance);
  };

  return (
    <Carousel className="md:w-2xl w-full max-h-full bg-[#15171C] border p-1 rounded-lg">
      <CarouselContent className="flex flex-col h-[70vh] overflow-y-scroll no-scrollbar">
        <div className="flex-center mt-4">
          <span className="text-medium font-semibold">
            Random<span className="text-orange-1 ml-2">Word</span>
          </span>
        </div>
        {words[slideIndex]?.type?.map(
          (item: WordObject["type"][0], index: number) => (
            <div key={index}>
              {item.partOfSpeech.length > 1 && (
                <div key={index}>
                  <CarouselItem>
                    <div className="flex flex-col h-[70vh] overflow-y-scroll no-scrollbar ml-2">
                      <div className="flex flex-col">
                        <div className="flex flex-col ml-4 space-y-1 flex-grow">
                          <span className="text-medium font-semibold capitalize">
                            {words[slideIndex]?.word}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-[12px] text-gray-400">
                              As a {item.partOfSpeech}
                            </span>

                            <div className="mt-2 space-y-2 mb-20">
                              <p>
                                {
                                  words[slideIndex]?.definition[index]
                                    ?.definition
                                }
                              </p>

                              <p className="text-gray-400 text-[12px]">
                                {words[slideIndex]?.definition[index]?.example}
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="flex-center">
                          <div>
                            <button onClick={speak}>Speak</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CarouselItem>
                </div>
              )}
            </div>
          )
        )}
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
