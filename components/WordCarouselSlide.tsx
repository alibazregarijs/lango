"use client";

import React from "react";
import { WordObject } from "@/types";
import Spinner from "./Spinner";
import { CarouselItem } from "@/components/ui/carousel";
import { Play } from "iconsax-reactjs";
import {type WordCarouselSlideProps} from "@/types/index"


export const WordCarouselSlide = ({
  words,
  slideIndex,
  loading,
  speak,
  title = (
    <div className="flex-center mt-4">
      <span className="text-medium font-semibold">
        Random<span className="text-orange-1 ml-2">Word</span>
      </span>
    </div>
  ),
}: WordCarouselSlideProps) => {
  return (
    <div className="bg-[#15171C]">
      {title}
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        words[slideIndex]?.type?.map(
          (item: WordObject["type"][0], index: number) => (
            item.partOfSpeech.length > 1 && (
              <CarouselItem key={slideIndex-index}>
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
                            {words[slideIndex]?.definition[index]?.definition}
                          </p>
                          <p className="text-gray-400 text-[12px]">
                            {words[slideIndex]?.definition[index]?.example}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex-center">
                      <div
                        className="flex-center flex-col space-y-2"
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
        )
      )}
    </div>
  );
};