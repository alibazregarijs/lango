"use client";

import { api } from "@/convex/_generated/api";
import { useAction } from "convex/react";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "@/components/Select";
import { Modal } from "@/components/Modal";
const Essay = () => {
  const [essay, setEssay] = useState("");
  const [level, setLevel] = useState("elementary_school");
  const [open, setOpen] = useState(false);
  // const getEssayEvaluation = useAction(api.openai.EvaluateEssayAction);

  // try {
  //   const fetchEssayEvaluation = async () => {
  //     const response = await getEssayEvaluation({
  //       essay:
  //         "Nature is the foundation of all life, offering beauty, balance, and resources essential for survival. It provides us with fresh air, clean water, and food to sustain our daily lives. The vibrant landscapes and diverse wildlife inspire peace and creativity. Protecting nature is vital to ensure a healthy planet for future generations. By respecting and preserving the environment, we nurture our own well-being.",
  //       level: "mid school",
  //     });

  //     const cleanedArr = response.map((str) => str.replace(/\n/g, ""));
  //     console.log(cleanedArr);
  //   };
  //   fetchEssayEvaluation();
  // } catch (error) {
  //   console.error(error);
  // }

  const submit = () => {
    console.log(essay, "essay");
    console.log(level, "level");
    setOpen(true);
  };

  return (
    <div className="flex-center w-full h-full">
      <div className="flex flex-col md:w-2xl w-full h-[70vh] bg-[#15171C] border p-1 rounded-lg">
        <span className="flex-center text-gray-400 text-xl font-semibold">
          Improve your writing skills with
          <span className="text-orange-1 ml-1"> AI</span>
        </span>

        <div className="flex flex-col items-center  h-[40vh] mt-4">
          <div className="w-[70vh] mb-4 mt-4">
            <SelectDemo setLevel={setLevel} />
          </div>
          <Textarea
            placeholder="Enter your essay here"
            className="w-[70vh] h-full bg-transparent text-[14px] custom-scrollbar sm:text-[12px] md:text-[14px] text-white p-4 rounded-lg"
            onChange={(e) => setEssay(e.target.value)}
          />

          <div className="w-[70vh] mt-4">
            <Button
              onClick={submit}
              className="bg-orange-1 text-white hover:bg-black-2 cursor-pointer"
            >
              Submit
            </Button>

            <Modal setOpen={setOpen} open={open} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essay;
