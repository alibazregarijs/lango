import React from "react";
import { Airpods } from "iconsax-reactjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "@/components/Select";
import Spinner from "./Spinner";
import { type ListeningCarouselSlideProps } from "@/types";

const ListeningCarouselSlideComponent = ({
  handleIconClick,
  level,
  setLevel,
  onSubmit,
  setAnswer,
  loading,
  answer,
  disabled,
  isProcessing
}: ListeningCarouselSlideProps) => {
  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="flex flex-col items-center justify-center w-[100%] bg-[#15171C] border-1 p-2 rounded-lg mt-4">
          <span className="text-gray-400 max-sm:text-[14px] ml-2">
            Select your level then click the{" "}
            <span className="text-orange-1">icon</span> to start the quiz.
          </span>

          <div className="flex flex-col w-full space-y-4">
            <div className="flex-center flex-col space-y-4 mt-2">
              <Airpods
                className="w-10 h-10 text-gray-400 cursor-pointer"
                onClick={handleIconClick}
                color="#FF8A65"
              />
              <SelectDemo setLevel={setLevel} level={level} />
            </div>

            <div className="w-full border-t-1 border-gray-400 my-4"></div>
          </div>

          <div className="flex flex-col w-full h-full space-y-2">
            <div className="flex-center flex-col h-full w-full space-y-2">
              <div className="flex flex-col justify-start w-[70%] h-[100%] space-y-4">
                <Textarea
                  placeholder="Write everything you heard."
                  className="text-white p-4 rounded-lg md:text-[14px] text-[12px] lsm:h-[50px] overflow-y-auto resize-none custom-scrollbar"
                  onChange={(e) => setAnswer(e.target.value)}
                  value={answer}
                  disabled={disabled}
                />
                <div className="flex justify-start w-[70%]">
                  <Button
                    className="bg-black-2 text-white cursor-pointer hover:bg-orange-1"
                    onClick={onSubmit}
                    disabled={disabled}
                  >
                    {isProcessing ? "Processing..." : "Submit"}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// 👇 Memoized export
export default React.memo(ListeningCarouselSlideComponent);
