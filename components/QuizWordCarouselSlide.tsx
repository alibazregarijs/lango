import React, { memo } from "react";
import { SelectDemo } from "@/components/Select";
import { WordsBox } from "@/components/WordsBox";
import { type CheckboxItemProps } from "@/types/index";
import Spinner from "./Spinner";

const QuizWordCarouselSlide = ({
  level,
  setLevel,
  question,
  items,
  loading,
  handleSubmit,
  disabled,
  slideIndex
}: {
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  question: string;
  items: CheckboxItemProps[];
  loading: boolean;
  handleSubmit: (choosedWord: string) => void;
  disabled: boolean;
  slideIndex: number;
}) => {
  return (
    <div className="flex-center bg-[#15171C] border-1 rounded-lg mt-4 p-2">
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
            <WordsBox slideIndex={slideIndex} items={items} onSubmitHandler={handleSubmit} disabled={disabled} />
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(QuizWordCarouselSlide);
