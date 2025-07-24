import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { wordProps } from "@/app/(root)/words/page";
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
  words: wordProps[];
  slideIndex: number;
}) {
  return (
    <Carousel className="w-full max-w-xs bg-[#f97535] p-1 rounded-lg">
      <CarouselContent>
        {words.map((word, index) => (
          <CarouselItem key={index}>
            <div className="">
              <Card className="bg-[#15171C]">
                <div className="flex flex-col">
                  <div className="flex-center">
                    <span className="text-medium font-semibold">
                      Random
                      <span className="text-medium font-semibold text-orange-1 ml-2">
                        Word
                      </span>
                    </span>
                  </div>
                  <div className="flex flex-col ml-4 mt-10 space-y-1">
                    <span className="text-medium font-semibold">
                      {word.word}
                    </span>
                    <span className="text-[12px]">{word.type}</span>
                  </div>
                  <div className="flex-center mt-10">
                    <audio controls>
                      <source
                        src="https://api.dictionaryapi.dev/media/pronunciations/en/start-us.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>

                    <audio controls>
                      <source
                        src="https://api.dictionaryapi.dev/media/pronunciations/en/start-uk.mp3"
                        type="audio/mpeg"
                      />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{word.word}</span>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
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
