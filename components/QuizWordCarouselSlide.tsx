import React, { useEffect } from "react";
import { SelectDemo } from "@/components/Select";
import { WordsBox } from "@/components/WordsBox";
import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import { useState } from "react";
import { useCarousel } from "@/hooks/useCarousel";
import { type CheckboxItemProps } from "../app/(root)/quiz/words/page";
import Spinner from "./Spinner";

const QuizWordCarouselSlide = ({
  level,
  setLevel,
  question,
  items,
  loading,
}: {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  question: string;
  items: CheckboxItemProps[];
  loading: boolean;
}) => {

  
  return (
    <div className="flex-center bg-[#15171C] border-1 rounded-lg mt-2 p-2">
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="flex flex-col h-[100%] space-y-12">
          <div className="flex flex-col space-y-2">
            <span className="flex-center text-gray-400 lsm:text-[12px] max-sm:text-[14px]">
              Choose right word.
            </span>
            <div className="flex-center mt-2">
              <SelectDemo setLevel={setLevel} level={level} />
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <span className="text-gray-400 lsm:text-[12px] max-sm:text-[14px]">
              {question}
            </span>
          </div>

          <div className="">
            <WordsBox items={items} />
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizWordCarouselSlide;
