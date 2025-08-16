"use client";

import Spinner from "./Spinner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserContext } from "@/context/UserContext";

export function UserProvider({
  userId,
  userImageUrl,
  username,
  children,
}: {
  userId: string | null;
  userImageUrl: string | null;
  username: string | null;
  children: React.ReactNode;
}) {
  if (!userId) return <Spinner loading={true} />;
  return (
    <>
      <UserContext.Provider value={{ userId, userImageUrl, username }}>
        {children}
      </UserContext.Provider>
    </>
  );
}
