"use client";

import React from "react";
import { WordObject } from "@/types";
import Spinner from "./Spinner";
import { CarouselItem } from "@/components/ui/carousel";
import { Play } from "iconsax-reactjs";
import { WordCarouselSlideProps } from "@/types/index";

export const WordCarouselSlide = ({
  words,
  slideIndex,
  loading,
  speak,
  title = (
    <div className="flex-center flex mt-4">
      <span className="text-medium font-semibold">
        Random<span className="text-orange-1 ml-2">Word</span>
      </span>
    </div>
  ),
}: WordCarouselSlideProps) => {
  return (
    <div className="bg-[#15171C] w-full flex flex-col">
      {title}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Spinner loading={loading} />
        </div>
      ) : (
        words[slideIndex]?.type?.map(
          (item: WordObject["type"][0], index: number) =>
            item.partOfSpeech.length > 1 && (
              <CarouselItem key={slideIndex - index}>
                <div className="flex flex-col w-full px-4 mt-4">
                  <div className="flex flex-col border border-gray-700 rounded-md p-4 max-w-[600px] w-full mx-auto">
                    <span className="text-medium font-semibold capitalize">
                      {words[slideIndex]?.word}
                    </span>
                    <span className="text-[12px] text-gray-400">
                      As a {item.partOfSpeech}
                    </span>

                    <div className="mt-2 space-y-2">
                      <p>{words[slideIndex]?.definition[index]?.definition}</p>
                      <p className="text-gray-400 text-[12px]">
                        {words[slideIndex]?.definition[index]?.example}
                      </p>
                    </div>

                    <div className="flex-center mt-8">
                      <div
                        className="flex-center flex-col space-y-2 cursor-pointer"
                        onClick={speak}
                      >
                        <Play
                          className="cursor-pointer"
                          size="34"
                          color="#F97535"
                          variant="Bulk"
                        />
                        <span className="text-gray-400 text-sm">
                          Click to play
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            )
        )
      )}
    </div>
  );
};
