import React from "react";
import { Button } from "@/components/ui/button";
import { quizItems } from "@/constants";
import Link from "next/link";

const page = () => {
  return (
    <div className="flex-center flex-col">
      Welcome to your quiz page
      <div className="flex-center space-x-4 mt-10">
        {quizItems.map((item) => (
          <Link href={item.href} key={item.name}>
            <Button key={item.name}>{item.name} quiz</Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
