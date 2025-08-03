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
    <div className="flex-center bg-[#15171C] mt-2">
      <div className="flex flex-col h-[70vh] md:w-2xl">
        <div className="flex flex-col space-y-2">
          <span className="flex-center">Choose the right word.</span>
          <div className="flex-center">
            <SelectDemo setLevel={setLevel} level={level} />
          </div>
        </div>

        <div className="md:flex flex-center flex-1">
          <span className="text-gray-400">1. We are here to ____ you.</span>
        </div>

        <div className="ml-21 md:ml-20 mb-4">
          <WordsBox />
        </div>
      </div>
    </div>
  );
};

export default QuizWordCarouselSlide;
