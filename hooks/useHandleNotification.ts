// hooks/useNotification.ts
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { type allUsersProps } from "@/types";

interface UseUserSelectionOptions {
  onReset: () => void;
  onModalClose?: () => void;
}

export const useNotification = () => {
  const sendNotification = useMutation(api.Notifications.createNotification);

  const sendNotificationToUser = async (
    userId: string,
    userTakerId: string,
    userSenderName: string,
    userSenderImageUrl: string
  ) => {
    try {
      const routeUrl = "/chat/" + uuidv4();
      const res = await sendNotification({
        userTakerId: userTakerId!,
        userSenderId: userId,
        userSenderImageUrl: userSenderImageUrl,
        userSenderName: userSenderName!,
        text: "Lets have a chat",
        read: false,
        accept: false,
        routeUrl: routeUrl,
      });

      if (res) {
        toast.success("Chat request sent to the user.");
        return {
          success: true,
          routeUrl,
          message: "Chat request sent to the user.",
        };
      }

      toast.error("You already have sent a chat request to this user.");
      return {
        success: false,
      };
    } catch (error) {
      console.error("Error sending notification:", error);
      return {
        success: false,
      };
    }
  };

  return {
    sendNotificationToUser,
  };
};

export const useUserSelection = ({
  onReset,
  onModalClose,
}: UseUserSelectionOptions) => {
  const router = useRouter();
  const { sendNotificationToUser } = useNotification();
  const requestInProgressRef = useRef(false);

  const handleUserSelection = useCallback(
    async (
      selectedUserData: allUsersProps,
      userId: string,
      username: string,
      userImageUrl: string
    ) => {
      // Prevent duplicate requests
      if (requestInProgressRef.current) {
        return;
      }

      requestInProgressRef.current = true;

      try {
        const result = await sendNotificationToUser(
          userId,
          selectedUserData.clerkId,
          username,
          userImageUrl
        );

        if (result.success) {
          onReset();
          onModalClose?.();
          router.push(
            `${result.routeUrl}?userSenderId=${userId}&userTakerId=${selectedUserData.clerkId}&imageUrl=${selectedUserData.imageUrl}`
          );
        } else {
          onReset();
        }
      } catch (error) {
        console.error("Error sending notification:", error);
        onReset();
      } finally {
        requestInProgressRef.current = false;
      }
    },
    [sendNotificationToUser, onReset, onModalClose, router]
  );

  return {
    handleUserSelection,
  };
};
