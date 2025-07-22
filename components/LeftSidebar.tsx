"use client";
import React from "react";
import { Book, PenAdd, Profile } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full ml-4">
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;
        
        return (
          <div key={item.name} className="flex flex-1 items-center">
            <Link 
              href={item.href}
              className={`flex p-2 items-center space-x-2 transition-colors ${
                isActive 
                  ? "text-orange-600 bg-white rounded-lg" 
                  : "text-gray-600  rounded-lg hover:opacity-80"
              }`}
            >
              {item.name === "Words" && (
                <Book size="24" color={isActive ? "#F97535" : "#6B7280"} />
              )}
              {item.name === "Essay" && (
                <PenAdd size="24" color={isActive ? "#F97535" : "#6B7280"} />
              )}
              {item.name === "Profile" && (
                <Profile size="24" color={isActive ? "#F97535" : "#6B7280"} />
              )}
              <span className={`text-sm font-medium ${isActive ? "text-black-1" : "text-white"}`}>{item.name}</span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSidebar;