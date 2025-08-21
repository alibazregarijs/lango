"use client";
import React, { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useQuery } from "convex/react";
import { Message } from "iconsax-reactjs";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Headphones,
  BookText,
  ChevronRight,
  Crown,
} from "lucide-react";
import Image from "next/image";
import { getPlayerLevel } from "@/utils";
import RightSidebarSkeleton from "@/components/RightSidebarSkeleton";
import { LEVELS } from "@/constants";
import { getGmailUsername } from "@/utils";
import { Modal } from "@/components/Modal";
import Searchbar from "@/components/Searchbar";

const RightSidebar = () => {
  const { userId, userImageUrl, username } = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const score = useQuery(api.users.getUserTotalScore, { userId: userId! });
  const topPlayers = useQuery(api.users.getTopPlayers);

  const recentListeningQuizzes = useQuery(
    api.ListeningQuiz.getRecentListeningQuizzes,
    { userId: userId! }
  );
  const recentWordQuizzes = useQuery(api.WordsQuiz.getRecentListeningQuizzes, {
    userId: userId!,
  });

  const users = useQuery(api.users.getAllUsers);

  const playerLevel = getPlayerLevel(score!);

  if (
    score === undefined ||
    recentListeningQuizzes === undefined ||
    userImageUrl === undefined ||
    recentWordQuizzes === undefined ||
    !userId ||
    topPlayers === undefined
  ) {
    return <RightSidebarSkeleton />;
  }

  return (
    <div className="flex flex-col p-4 bg-black-1 border-l border-black-5 h-[calc(100vh-40px)] overflow-y-auto no-scrollbar">
      {/* User Profile Section */}
      <div className="flex items-center gap-3 p-3 rounded-lg bg-black-2 mb-6">
        {userImageUrl ? (
          <Image
            src={userImageUrl}
            alt={username || "user avatar"}
            width={40}
            height={40}
            className="rounded-full border-2 border-orange-1"
          />
        ) : (
          <div className="w-10 h-10 rounded-full border-2 border-orange-1 bg-black-4 flex items-center justify-center">
            <span className="text-white-3 text-lg line-clamp-2">
              {username?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-white-5 font-medium truncate">
            {username || "Anonymous"}
          </p>
          <p className="text-gray-1 text-sm">Level {playerLevel} Explorer</p>
        </div>
      </div>

      {/* Score Card */}
      <div className="bg-black-6 rounded-xl p-4 mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white-5 font-semibold">Your Score</h3>
          <Trophy size={20} className="text-orange-1" />
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold text-white-1">{score ?? 0}</span>
          <span className="text-white-3 text-sm mb-1">points</span>
        </div>
        <div className="w-full bg-black-5 rounded-full h-2 mt-3">
          <div
            className="bg-orange-1 h-2 rounded-full"
            style={{ width: `${Math.min(((score ?? 0) / 900) * 100, 900)}%` }}
          ></div>
        </div>
      </div>

      {/* chat */}
      <div className="flex justify-center items-center space-x-2 bg-black-2 rounded-xl p-4 mb-6">
        <Button
          variant="outline"
          onClick={() => setIsModalOpen(true)}
          className="bg-transparent"
        >
          <Message size="24" color="#F97535" />
          Chat with someone
        </Button>
      </div>

      {/* Top Players Section */}
      <div className="bg-black-2 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-4 truncate">
          <h3 className="text-white-5 font-semibold flex items-center gap-2">
            <Crown size={18} className="text-orange-1" />
            Top Players
          </h3>
          <ChevronRight size={18} className="text-gray-1" />
        </div>
        {topPlayers?.map((player, index) => (
          <div
            key={player.userId}
            className="flex lg:flex-col items-center w-full gap-3 p-3 rounded-lg transition-colors"
          >
            {/* Avatar section remains the same */}
            <div className="relative flex-shrink-0">
              {player.imageUrl ? (
                <Image
                  src={player.imageUrl}
                  alt={getGmailUsername(player.gmail) || "user avatar"}
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-orange-1"
                />
              ) : (
                <div className="w-10 h-10 rounded-full border-2 border-orange-1 bg-black-4 flex items-center justify-center">
                  <span className="text-white-3 text-lg">
                    {getGmailUsername(player.gmail)}
                  </span>
                </div>
              )}
              {index === 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-1 rounded-full w-5 h-5 flex items-center justify-center">
                  <Crown size={12} className="text-black-1" />
                </div>
              )}
            </div>

            {/* Username and mobile level */}
            <div className="flex-1 min-w-0 lg:flex lg:items-center lg:gap-3">
              <p className="text-white-4 font-medium truncate">
                {getGmailUsername(player.gmail)}
              </p>
              <p className="text-gray-1  text-xs lg:hidden truncate">
                Level {getPlayerLevel(player.totalScore)} Explorer
              </p>
            </div>

            {/* Score and desktop level */}
            <div className="flex flex-col items-end lg:items-center lg:max-w-[120px] lg:w-full">
              <div className="flex justify-center items-center gap-1">
                <Trophy size={16} className="text-orange-1" />
                <span className="text-white-3 font-medium">
                  {player.totalScore}
                </span>
              </div>
              <p className="text-gray-1 text-xs hidden lg:block lg:text-center truncate w-full">
                Level {getPlayerLevel(player.totalScore)} Explorer
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Quizzes Section */}
      <div className="space-y-6">
        {/* Listening Quizzes */}
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

        {/* Word Quizzes */}
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
      </div>

      {/* Modal */}
      <Modal open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Modal.Content>
          <Modal.Section title="Search for people and chat with them">
            <Searchbar users={true} />
          </Modal.Section>
        </Modal.Content>
      </Modal>
    </div>
  );
};

export default RightSidebar;
