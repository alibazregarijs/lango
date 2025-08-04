import React from "react";
import { SelectDemo } from "@/components/Select";
import { WordsBox } from "@/components/WordsBox";

const QuizWordCarouselSlide = ({
  level,
  setLevel,
}: {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="flex-center bg-[#15171C] border-1 rounded-lg mt-2 p-2">
      <div className="flex flex-col h-[100%] space-y-12">
        <div className="flex flex-col space-y-2">
          <span className="flex-center text-gray-400 lsm:text-[12px] max-sm:text-[14px]">Choose right word.</span>
          <div className="flex-center mt-2">
            <SelectDemo setLevel={setLevel} level={level} />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center">
          <span className="text-gray-400 lsm:text-[12px] max-sm:text-[14px]">1. We are here to ____ you.</span>
        </div>

        <div className="">
          <WordsBox />
        </div>
      </div>
    </div>
  );
};

export default QuizWordCarouselSlide;
