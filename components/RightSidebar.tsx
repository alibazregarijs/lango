"use client";
import React from "react";
import { useUser } from "@/context/UserContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trophy } from "lucide-react"; // Using Trophy instead of Cup for better visual
import Image from "next/image";
import { getPlayerLevel } from "@/utils";

const RightSidebar = () => {
  const { userId, userImageUrl, username } = useUser();
  const score = useQuery(api.users.getUserTotalScore, { userId: userId! });
  const playerLevel = getPlayerLevel(score!);

  return (
    <div className="flex flex-col w-64 h-screen p-4 bg-black-1 fixed right-0 top-0 border-l border-black-5">
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
            <span className="text-white-3 text-lg">
              {username?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <div>
          <p className="text-white-5 font-medium">{username}</p>
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
            style={{ width: `${Math.min(((score ?? 0) / 100) * 100, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* most recent quiz */}
      <div>{/* here */}</div>
    </div>
  );
};

export default RightSidebar;
