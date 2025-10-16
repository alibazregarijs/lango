import React from "react";
import Image from "next/image";
import { getPlayerLevel } from "@/utils";
import { getGmailUsername } from "@/utils";
import { Crown, ChevronRight, Trophy } from "lucide-react";
import { type TopPlayerProps } from "@/types";

const TopPlayerListing = ({topPlayers}: {topPlayers: TopPlayerProps[]}) => {
  return (
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
  );
};

export default TopPlayerListing;
