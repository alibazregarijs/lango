import React from "react";
import { Headphones, ChevronRight } from "lucide-react";
import { LEVELS } from "@/constants";
import { type ListeningQuizProps } from "@/types";

const ListeningQuizListing = ({recentListeningQuizzes}: {recentListeningQuizzes: ListeningQuizProps[]}) => {
  return (
    <div className="bg-black-2 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white-5 font-semibold flex items-center gap-2">
          <Headphones size={18} className="text-orange-1" />
          Recent Listening
        </h3>
        <ChevronRight size={18} className="text-gray-1" />
      </div>
      <div className="space-y-3">
        {recentListeningQuizzes.length > 0 ? (
          recentListeningQuizzes.map((quiz, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-black-5 transition-colors"
            >
              <p className="text-white-4 text-sm line-clamp-2 mb-1">
                {quiz.sentence}
              </p>
              <div className="flex flex-col justify-between items-start md:items-center">
                <span key={index} className="text-xs text-gray-1">
                  {LEVELS[quiz?.level]}
                </span>
                <span
                  className={`text-xs font-medium ${
                    quiz.grade === "A" ? "text-orange-1" : "text-white-3"
                  }`}
                >
                  Grade: {quiz.grade}
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

export default ListeningQuizListing;
