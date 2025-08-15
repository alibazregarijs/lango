// src/components/UserProvider.tsx
"use client";

import { UserContext } from "@/context/UserContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Spinner from "./Spinner";

export function UserProvider({
  userId,
  children,
}: {
  userId: string | null;

  children: React.ReactNode;
}) {
  if (!userId) {
    return <Spinner loading={true} />; // or null, or a loading state
  }

  const user = useQuery(api.users.getUserById, {
    clerkId: userId!,
  });

  if (!user) {
    return <Spinner loading={true} />;
  }

  const userImageUrl = user!.imageUrl;
  const username = user!.name;

  return (
    <UserContext.Provider value={{ userId, userImageUrl, username }}>
      {children}
    </UserContext.Provider>
  );
}
