"use client";

import { createContext, useContext } from "react";

type UserContextType = {
  userId: string | null;
  userImageUrl: string | null;
  username: string | null;
};

export const UserContext = createContext<UserContextType>({
  userId: null,
  userImageUrl: null,
  username: null,
});

export const useUser = () => useContext(UserContext);
