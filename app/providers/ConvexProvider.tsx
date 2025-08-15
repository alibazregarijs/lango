"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import Spinner from "@/components/Spinner";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);



export function ConvexClientProvider({ children }: { children: ReactNode }) {
  if (!convex) return <Spinner loading={true} />;
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}