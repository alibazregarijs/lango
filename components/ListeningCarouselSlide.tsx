import React from "react";
import { Airpods } from "iconsax-reactjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "@/components/Select";
import Spinner from "./Spinner";

const ListeningCarouselSlide = ({
  handleIconClick,
  level,
  setLevel,
  onSubmit,
  setAnswer,
  loading,
}: {
  handleIconClick: () => void;
  level: string;
  setLevel: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  setAnswer: React.Dispatch<React.SetStateAction<string>>;
  loading: boolean;
}) => {
  return (
    <>
      {loading ? (
        <Spinner loading={loading} />
      ) : (
        <div className="flex flex-col items-center h-full w-full bg-[#15171C]">
          <span className="text-gray-400 mt-4">
            Select your level ten click the{" "}
            <span className="text-orange-1">icon</span> to start the quiz.
          </span>

          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex-center space-x-4">
              <Airpods
                className="w-10 h-10 text-gray-400 cursor-pointer"
                onClick={handleIconClick}
                color="#FF8A65"
              />
              <SelectDemo setLevel={setLevel} level={level} />
            </div>

            <div className="w-[90vh] border-t-1 border-gray-400 my-4"></div>
          </div>

          <div className="flex flex-col h-full space-y-2">
            <div className="flex h-full">
              <Textarea
                placeholder="Please write everything you heard."
                className="w-[70vh] md:text-[16px] text-[14px]"
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Button className="bg-black-2 text-white cursor-pointer hover:bg-orange-1" onClick={onSubmit}>Submit</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ListeningCarouselSlide;
