// hooks/useNotification.ts
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export const useNotification = () => {
  const sendNotification = useMutation(api.Notifications.createNotification);
  const router = useRouter();

  const sendNotificationToUser = async (
    userId: string,
    userTakerId: string,
    userSenderName: string,
    userSenderImageUrl: string
  ) => {
    try {
      let routeUrl = "/chat/" + uuidv4();
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
