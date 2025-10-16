import React from "react";
import { Button } from "@/components/ui/button";
import { quizItems } from "@/constants";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex-center flex-col w-full h-full justify-center items-center mt-4 mb-2">
      <div>
        <span className="flex-center text-gray-400 text-xl">
          We are here to <span className="text-orange-1 mx-1">quiz</span> you.
        </span>
        <div className="flex-center space-x-4 mt-10">
          {quizItems.map((item) => (
            <Link href={item.href} key={item.name}>
              <Button
                className="bg-black-2 text-white hover:bg-orange-1 cursor-pointer"
                key={item.name}
              >
                {item.name} quiz
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
