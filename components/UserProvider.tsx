// src/components/UserProvider.tsx
"use client";

import { UserContext } from "@/context/UserContext";

export function UserProvider({
  userId,
  children,
}: {
  userId: string | null;
  children: React.ReactNode;
}) {
  return (
    <UserContext.Provider value={{ userId }}>
      {children}
    </UserContext.Provider>
  );
}
