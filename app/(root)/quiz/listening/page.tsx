"use client";
import React from "react";
import { Airpods } from "iconsax-reactjs";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "@/components/Select";

const page = () => {
  const [level, setLevel] = React.useState("pre_school");

  const handleClick = () => {
    console.log("start");
  };

  return (
    <div className="flex flex-col items-center h-full w-full">
      <span className="text-gray-400 mt-4">
        Select your level ten click the <span className="text-orange-1">icon</span> to start the quiz.
      </span>

      <div className="flex flex-col space-y-4 mt-4">
        <div className="flex-center space-x-4">
          <Airpods
            className="w-10 h-10 text-gray-400 cursor-pointer"
            onClick={handleClick}
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
          />
        </div>
        <div className="mb-4">
          <Button>Submit</Button>
        </div>
      </div>
    </div>
  );
};

export default page;
