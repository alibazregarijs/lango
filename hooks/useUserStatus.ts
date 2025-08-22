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

    // Function to update user status
    const updateStatus = (online: boolean) => {
      updateUserStatus({
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: getGmailUsername(user.emailAddresses[0]?.emailAddress) || undefined,
        imageUrl: user.imageUrl,
        online,
      });
    };

    // Initial status update - mark as online
    updateStatus(true);

    // Set up interval to update last seen (only when tab is visible)
    let interval: NodeJS.Timeout;
    const setupInterval = () => {
      interval = setInterval(() => {
        // Only update if the tab is visible
        if (!document.hidden) {
          updateStatus(true);
        }
      }, 30000); // Update every 30 seconds
    };

    setupInterval();

    // Handle visibility change
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab is hidden - mark as offline
        updateStatus(false);
        clearInterval(interval);
      } else {
        // Tab is visible again - mark as online and restart interval
        updateStatus(true);
        setupInterval();
      }
    };

    // Add event listener for visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup function
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      // Mark as offline when component unmounts
      if (user) {
        updateStatus(false);
      }
    };
  }, [user, isLoaded, updateUserStatus]);
};