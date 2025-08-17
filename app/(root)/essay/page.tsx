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
import Spinner from "@/components/Spinner";

const Essay = () => {
  const { userId } = useUser();
  const [essay, setEssay] = useState("");
  const [level, setLevel] = useState("pre_school");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState({
    grade: "",
    grammer: "",
    suggestion: "",
  });

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
    );
    if (!isTextNull) {
      setLoading(false);
      return;
    }

    const fetchEssayEvaluation = async () => {
      try {
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
        await handleCreateEssay({ essay: essayObj });
        setOpen(true);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchEssayEvaluation();
  };

  if (!userId) return <Spinner loading={true} />;

  return (
    <div className="flex h-full flex-center">
      <div className="lg:w-[90%]   w-full mt-4">
        <div className="flex flex-col justify-center w-[100%] bg-[#15171C] border p-1 rounded-lg">
          <span className="flex-center text-gray-400 text-xl max-sm:text-[16px] md:font-semibold">
            Improve your writing skills with
            <span className="text-orange-1 ml-1"> AI</span>
          </span>

          <div className="flex flex-col items-center mt-4">
            <div className="mb-4 mt-4">
              <SelectDemo setLevel={setLevel} level={level} />
            </div>
            <div className="flex flex-col justify-start w-[70%] h-[100%] space-y-4">
              <Textarea
                placeholder="Enter your essay here"
                className="text-white p-4 rounded-lg md:text-[14px] text-[12px] lsm:h-[50px] overflow-y-auto resize-none custom-scrollbar"
                onChange={(e) => setEssay(e.target.value)}
                value={essay}
              />
              <div className="w-[70%] flex justify-start mt-4">
                <Button
                  onClick={submit}
                  className="bg-orange-1 text-white hover:bg-black-2 cursor-pointer"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Submit"}
                </Button>
              </div>
            </div>

            <div className="w-[70vh] mt-4">
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
    </div>
  );
};

export default Essay;
