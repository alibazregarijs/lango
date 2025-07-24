"use client";

import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const page = () => {
  return (
    <div className="flex justify-center text-center">
      <h1 className="font-manrope">Hello world</h1>
      <h2 className="font-serif">salam</h2>
    </div>
  );
};

export default page;
