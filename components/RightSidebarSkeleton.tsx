"use client";
import React from "react";
import { Trophy, Headphones, BookText, ChevronRight } from "lucide-react";

const RightSidebarSkeleton = () => {
  return (
    <div className="flex flex-col h-full p-4 bg-black-1 border-l border-black-5 md:overflow-y-auto custom-scrollbar">
      {/* User Profile Section Skeleton */}
      <div className="flex items-center p-3 rounded-lg bg-black-2 mb-6 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-black-4 border-2 border-orange-1"></div>
        <div className="space-y-2">
          <div className="h-4 w-24 bg-black-4 rounded"></div>
          <div className="h-3 w-32 bg-black-4 rounded"></div>
        </div>
      </div>

      {/* Score Card Skeleton */}
      <div className="bg-black-6 rounded-xl p-4 mb-6 animate-pulse">
        <div className="flex justify-between items-center mb-2">
          <div className="h-5 w-20 bg-black-4 rounded"></div>
          <Trophy size={20} className="text-black-4" />
        </div>
        <div className="flex items-end gap-2">
          <div className="h-8 w-16 bg-black-4 rounded"></div>
          <div className="h-4 w-12 bg-black-4 rounded"></div>
        </div>
        <div className="w-full bg-black-4 rounded-full h-2 mt-3"></div>
      </div>

      {/* Recent Quizzes Section Skeleton */}
      <div className="space-y-6 animate-pulse">
        {/* Listening Quizzes Skeleton */}
        <div className="bg-black-2 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Headphones size={18} className="text-black-4" />
              <div className="h-5 w-24 bg-black-4 rounded"></div>
            </div>
            <ChevronRight size={18} className="text-black-4" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="p-3 rounded-lg bg-black-5">
                <div className="h-4 w-full bg-black-4 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-black-4 rounded"></div>
                  <div className="h-3 w-12 bg-black-4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Word Quizzes Skeleton */}
        <div className="bg-black-2 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <BookText size={18} className="text-black-4" />
              <div className="h-5 w-32 bg-black-4 rounded"></div>
            </div>
            <ChevronRight size={18} className="text-black-4" />
          </div>
          <div className="space-y-3">
            {[1, 2].map((item) => (
              <div key={item} className="p-3 rounded-lg bg-black-5">
                <div className="h-4 w-full bg-black-4 rounded mb-2"></div>
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-black-4 rounded"></div>
                  <div className="h-3 w-20 bg-black-4 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebarSkeleton;