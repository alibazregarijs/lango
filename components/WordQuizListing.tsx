import React from "react";
import { BookText, ChevronRight } from "lucide-react";
import { LEVELS } from "@/constants";
import { type WordQuizProps } from "@/types";

const WordQuizListing = ({recentWordQuizzes}: {recentWordQuizzes: WordQuizProps[]}) => {
  return (
    <div className="bg-black-2 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white-5 font-semibold flex items-center gap-2">
          <BookText size={18} className="text-orange-1" />
          Recent Word Quizzes
        </h3>
        <ChevronRight size={18} className="text-gray-1" />
      </div>
      <div className="space-y-3">
        {recentWordQuizzes.length > 0 ? (
          recentWordQuizzes.map((quiz, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-black-5 transition-colors"
            >
              <p className="text-white-4 text-sm line-clamp-2 mb-1">
                {quiz.question}
              </p>
              <div className="flex flex-col justify-between items-start md:items-center">
                <span className="text-xs text-gray-1">
                  {LEVELS[quiz?.level]}
                </span>
                <span className="flex flex-1 text-xs text-white-3 font-medium">
                  Correct:{" "}
                  <span className="text-orange-1">{quiz.correctWord}</span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white-4 text-sm line-clamp-2 mb-1">
            No recent listening quizzes
          </p>
        )}
      </div>
    </div>
  );
};

export default WordQuizListing;
