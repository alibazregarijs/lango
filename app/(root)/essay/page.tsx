"use client";

import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { SelectDemo } from "@/components/Select";
import { Modal } from "@/components/Modal";
import { useUser } from "@/context/UserContext";
import { essayProps } from "@/types";
import { checkNull } from "@/utils/index";

const Essay = () => {
  const [essay, setEssay] = useState("");
  const [level, setLevel] = useState("pre_school");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState({
    grade: "",
    grammer: "",
    suggestion: "",
  });

  const { userId } = useUser();

  const getEssayEvaluation = useAction(api.groqai.EvaluateEssayAction);
  const createEssayMutation = useMutation(api.essay.createEssayMutation);

  const handleCreateEssay = async ({ essay }: { essay: essayProps }) => {
    if (!userId) return;
    await createEssayMutation({
      ...essay,
      userId,
    });
  };
  const submit = () => {
    setLoading(true);

    const isTextNull = checkNull(
      essay,
      <span className="text-gray-400">Please write something.</span>
    ); // check if answer not to be null.
    if (!isTextNull) {
      return;
    }

    try {
      const fetchEssayEvaluation = async () => {
        const response = await getEssayEvaluation({
          essay,
          level,
        });

        const cleanedArr = response.map((str) => str.replace(/\n/g, ""));
        const grade = cleanedArr[0];
        const grammer = cleanedArr[1];
        const suggestion = cleanedArr[2];
        setEvaluation({
          grade,
          grammer,
          suggestion,
        });

        setEssay("");
        setLevel("pre_school");
        setLoading(false);

        if (!userId) return;

        const essayObj = {
          essay,
          level,
          userId,
          grade,
          grammer,
          suggestion,
        };
        handleCreateEssay({ essay: essayObj });
      };
      fetchEssayEvaluation();
    } catch (error) {
      console.error(error);
    }
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
            <SelectDemo setLevel={setLevel} level={level} />
          </div>
          <Textarea
            placeholder="Enter your essay here"
            className="w-[70vh] h-full bg-transparent text-[14px] custom-scrollbar sm:text-[12px] md:text-[14px] text-white p-4 rounded-lg"
            onChange={(e) => setEssay(e.target.value)}
            value={essay}
          />

          <div className="w-[70vh] mt-4">
            <Button
              onClick={submit}
              className="bg-orange-1 text-white hover:bg-black-2 cursor-pointer"
            >
              Submit
            </Button>

            <Modal open={open} onOpenChange={setOpen}>
              <Modal.Content>
                <Modal.Section
                  title="Pay attention to this point."
                  loading={loading}
                >
                  <Modal.Body label="Grade">{evaluation.grade}</Modal.Body>
                  <Modal.Body label="Grammatical problem">
                    {evaluation.grammer}
                  </Modal.Body>
                  <Modal.Body label="Suggestion">
                    {evaluation.suggestion}
                  </Modal.Body>
                </Modal.Section>
              </Modal.Content>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Essay;
