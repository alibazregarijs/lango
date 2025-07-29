"use client";

import { createContext, useContext } from "react";

type UserContextType = {
  userId: string | null;
};

export const UserContext = createContext<UserContextType>({
  userId: null,
});

export const useUser = () => useContext(UserContext);
