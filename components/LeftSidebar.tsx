"use client";
import React from "react";
import { Book,Book1, PenAdd } from "iconsax-reactjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarItems } from "@/constants";
import Image from "next/image";

const LeftSidebar = () => {
  const pathname = usePathname();

  return (
    <div className="flex md:flex-col h-full md:ml-4 space-x-2">
      <div className="flex items-start justify-start">
        <Image
          className="md:w-24 md:h-24 h-20 w-20"
          src={"/icons/logo.png"}
          priority
          width={500}
          height={500}
          alt="logo"
        />
      </div>
      {sidebarItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <div key={item.name} className="flex flex-1 items-center">
            <Link
              href={item.href}
              className={`flex md:p-2 p-[6px] items-center justify-center space-x-2 transition-colors ${
                isActive
                  ? "text-orange-600 bg-white rounded-lg"
                  : "text-gray-600  rounded-lg hover:opacity-80"
              }`}
            >
              {item.name === "Words" && (
                <Book  className="w-4 h-4 md:w-6 md:h-6" size="24" color={isActive ? "#F97535" : "#6B7280"} />
              )}
              {item.name === "Quiz" && (
                // <PenAdd size="24"  />
                <Book1  className="w-4 h-4 md:w-6 md:h-6" size="24" color={isActive ? "#F97535" : "#6B7280"}/>
              )}
              {item.name === "Essay" && (
                <PenAdd className="w-4 h-4 md:w-6 md:h-6" color={isActive ? "#F97535" : "#6B7280"} />
              )}
              <span
                className={`text-sm font-medium ${
                  isActive ? "text-black-1" : "text-white"
                }`}
              >
                {item.name}
              </span>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default LeftSidebar;
