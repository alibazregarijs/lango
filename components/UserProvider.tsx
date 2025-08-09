// src/components/UserProvider.tsx
"use client";

import { UserContext } from "@/context/UserContext";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export function UserProvider({
  userId,
  children,
}: {
  userId: string | null;

  children: React.ReactNode;
}) {
  const user = useQuery(api.users.getUserById, {
    clerkId: userId!,
  });

  const userImageUrl = user?.imageUrl!;
  const username = user?.name!;

  return (
    <UserContext.Provider value={{ userId, userImageUrl, username }}>
      {children}
    </UserContext.Provider>
  );
}
