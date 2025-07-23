"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const page = () => {
  const tasks = useQuery(api.tasks.get);
  return (
    <div className="flex justify-center text-center">
      <h1 className="font-manrope">Hello world</h1>
      <h2 className="font-serif">salam</h2>
      {tasks?.map((task) => (
        <div key={task.text}>
          <h3>{task.text}</h3>
          <p>{task.isCompleted ? "Completed" : "Not Completed"}</p>
        </div>
      ))}
    </div>
  );
};

export default page;
