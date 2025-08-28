// hooks/useNotificationQueries.ts
import { useQuery, useMutation, ReactMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMemo } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { type Message } from "@/types";

// hooks/useNotifications.ts (Main hook - orchestrates everything)
// Single responsibility: Orchestrate notification functionality
const useNotifications = () => {
  const { userId } = useUser();

  // Data layer
  const {
    unreadNotifications,
    markNotificationsAsRead,
    acceptNotificationByUser,
    markNotificationAsReadById,
    createChatRoom,
  } = useNotificationQueries(userId);

  // State layer
  const { notificationCount, hasUnreadNotifications } = useNotificationState(
    unreadNotifications as Message[]
  );

  // Navigation layer
  const { navigateToChat } = useNotificationNavigation();

  // Actions
  const markAllAsRead = () =>
    NotificationService.markAllAsRead(
      markNotificationsAsRead,
      userId!,
      hasUnreadNotifications
    );

  const handleAcceptNotification = async (
    notificationId: Id<"notifications">,
    routeUrl: string,
    userTakerId: string,
    userSenderId: string,
    imageUrl: string,
    onModalClose: () => void
  ) => {
    const success = await NotificationService.acceptNotification(
      acceptNotificationByUser,
      notificationId
    );
    await createChatRoomFunction({
      createChatRoom,
      userTakerId,
      userSenderId,
    });
    if (success) {
      navigateToChat(routeUrl, userSenderId, userTakerId, imageUrl);
      onModalClose();
    }
  };

  const handleReadNotification = async (
    notificationId: Id<"notifications">
  ) => {
    try {
      await markNotificationAsReadById({ notificationId });
    } catch (error) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  return {
    // Data
    unreadNotifications,
    notificationCount,
    hasUnreadNotifications,

    // Actions
    markAllAsRead,
    handleAcceptNotification,
    handleReadNotification,
  };
};

// Single responsibility: Handle Convex queries and mutations
export const useNotificationQueries = (userId: string | null) => {
  const unreadNotifications = useQuery(
    api.Notifications.getUnreadByUser,
    userId ? { userId } : "skip"
  );

  const markNotificationsAsRead = useMutation(
    api.Notifications.markNotificationsAsRead
  );

  const acceptNotificationByUser = useMutation(
    api.Notifications.acceptNotificationById
  );

  const markNotificationAsReadById = useMutation(api.Notifications.markAsRead);

  const createChatRoom = useMutation(api.ChatRooms.createChatRoom);

  return {
    unreadNotifications,
    markNotificationsAsRead,
    acceptNotificationByUser,
    markNotificationAsReadById,
    createChatRoom,
  };
};

// hooks/useNotificationState.ts
// Single responsibility: Calculate derived state from notifications data
export const useNotificationState = (notifications: Message[]) => {
  const notificationCount = useMemo(
    () => notifications?.length || 0,
    [notifications]
  );

  const hasUnreadNotifications = notificationCount > 0;

  return {
    notificationCount,
    hasUnreadNotifications,
  };
};

const createChatRoomFunction = async ({
  createChatRoom,
  userTakerId,
  userSenderId,
}: {
  createChatRoom: ReactMutation<typeof api.ChatRooms.createChatRoom>;
  userTakerId: string;
  userSenderId: string;
}) => {
  await createChatRoom({
    takerId: userTakerId,
    giverId: userSenderId,
  });
  return true;
};

// services/notificationService.ts
// Single responsibility: Handle notification business logic
export class NotificationService {
  static async markAllAsRead(
    markNotificationsAsRead: ReactMutation<
      typeof api.Notifications.markNotificationsAsRead
    >,
    userId: string,
    hasUnreadNotifications: boolean
  ) {
    if (!hasUnreadNotifications || !userId) return;
    try {
      await markNotificationsAsRead({ userId });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  }

  static async acceptNotification(
    acceptNotificationByUser: ReactMutation<
      typeof api.Notifications.acceptNotificationById
    >,

    notificationId: Id<"notifications">
  ) {
    try {
      await acceptNotificationByUser({
        notificationId: notificationId,
      });

      toast.success("You have accepted the request.");
      return true;
    } catch (error) {
      console.error("Error accepting notification:", error);
      toast.error("Failed to accept request");
      return false;
    }
  }
}

// hooks/useNotificationNavigation.ts

// Single responsibility: Handle navigation logic
export const useNotificationNavigation = () => {
  const router = useRouter();

  const navigateToChat = (
    routeUrl: string,
    userSenderId: string,
    userTakerId: string,
    imageUrl: string
  ) => {
    router.push(
      `${routeUrl}?userSenderId=${userSenderId}&userTakerId=${userTakerId}&imageUrl=${imageUrl}`
    );
  };

  return { navigateToChat };
};

export default useNotifications;
