"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getGmailUsername } from "@/utils";

export const useUserStatus = () => {
  const { user, isLoaded } = useUser();
  const updateUserStatus = useMutation(api.users.updateUserStatus);

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Update user as online
    updateUserStatus({
      clerkId: user.id,
      email: user.emailAddresses[0].emailAddress || "",
      name: getGmailUsername(user.emailAddresses[0].emailAddress) || undefined,
      imageUrl: user.imageUrl,
      online: true,
    });

    // Set up interval to update last seen
    const interval = setInterval(() => {
      updateUserStatus({
        clerkId: user.id,
        email: user.emailAddresses[0].emailAddress || "",
        name:
          getGmailUsername(user.emailAddresses[0].emailAddress) || undefined,
        imageUrl: user.imageUrl,
        online: true, // Keep user online
      });
    }, 30000); // Update every 30 seconds

    // Cleanup function to mark user as offline when they leave
    return () => {
      clearInterval(interval);
      if (user) {
        updateUserStatus({
          clerkId: user.id,
          email: user.emailAddresses[0].emailAddress || "",
          name:
            getGmailUsername(user.emailAddresses[0].emailAddress) || undefined,
          imageUrl: user.imageUrl,
          online: false,
        });
      }
    };
  }, [user, isLoaded, updateUserStatus]);
};
