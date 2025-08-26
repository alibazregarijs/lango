// hooks/useNotification.ts
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  type allUsersProps,
  UseUserSelectionOptionsProps,
  NavigateChatResultProps,
} from "@/types";

export const useRequestManager = () => {
  const requestInProgressRef = useRef(false);

  const executeRequest = async (requestFn: () => Promise<void>) => {
    if (requestInProgressRef.current) return;

    requestInProgressRef.current = true;
    try {
      await requestFn();
    } finally {
      requestInProgressRef.current = false;
    }
  };

  return { executeRequest };
};

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

// hooks/useNotificationSender.ts
export const useNotificationSender = () => {
  const { sendNotificationToUser } = useNotification();

  const sendChatRequest = async (
    selectedUserData: allUsersProps,
    userId: string,
    username: string,
    userImageUrl: string
  ) => {
    return await sendNotificationToUser(
      userId,
      selectedUserData.clerkId,
      username,
      userImageUrl
    );
  };

  return { sendChatRequest };
};

// hooks/useNavigationHandler.ts
export const useNavigationHandler = () => {
  const router = useRouter();

  const navigateToChat = (
    result: NavigateChatResultProps,
    userId: string,
    selectedUserData: allUsersProps
  ) => {
    router.push(
      `${result.routeUrl}?userSenderId=${userId}&userTakerId=${selectedUserData.clerkId}&imageUrl=${selectedUserData.imageUrl}`
    );
  };

  return { navigateToChat };
};

// hooks/useUserSelection.ts

export const useUserSelection = ({
  onReset,
  onModalClose,
}: UseUserSelectionOptionsProps) => {
  const { executeRequest } = useRequestManager();
  const { sendChatRequest } = useNotificationSender();
  const { navigateToChat } = useNavigationHandler();

  const handleUserSelection = useCallback(
    async (
      selectedUserData: allUsersProps,
      userId: string,
      username: string,
      userImageUrl: string
    ) => {
      await executeRequest(async () => {
        try {
          const result = await sendChatRequest(
            selectedUserData,
            userId,
            username,
            userImageUrl
          );

          if (result?.success) {
            onReset();
            onModalClose?.();
            navigateToChat(result, userId, selectedUserData);
          } else {
            onReset();
          }
        } catch (error) {
          console.error("Error in user selection:", error);
          onReset();
        }
      });
    },
    [executeRequest, sendChatRequest, navigateToChat, onReset, onModalClose]
  );

  return {
    handleUserSelection,
  };
};
