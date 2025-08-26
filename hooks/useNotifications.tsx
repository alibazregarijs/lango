import { useMemo } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

const useNotifications = () => {
  const { userId } = useUser();
  const router = useRouter();

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

  // Derived state
  const notificationCount = useMemo(
    () => unreadNotifications?.length || 0,
    [unreadNotifications]
  );

  const hasUnreadNotifications = notificationCount > 0;

  const markAllAsRead = async () => {
    if (!hasUnreadNotifications || !userId) return;
    try {
      await markNotificationsAsRead({ userId });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const handleAcceptNotification = async (
    notificationId: Id<"notifications">,
    routeUrl: string,
    userTakerId: string,
    userSenderId: string,
    imageUrl: string,
    onModalClose: () => void
  ) => {
    try {
      await acceptNotificationByUser({ notificationId });
      await createChatRoom({
        takerId: userTakerId,
        giverId: userSenderId,
      });
      toast.success("You have accepted the request.");
      router.push(
        `${routeUrl}?userSenderId=${userSenderId}&userTakerId=${userTakerId}&imageUrl=${imageUrl}`
      );
      onModalClose();
    } catch (error) {
      console.error("Error accepting notification:", error);
      toast.error("Failed to accept request");
    }
  };

  return {
    unreadNotifications,
    notificationCount,
    hasUnreadNotifications,
    markAllAsRead,
    acceptNotificationByUser,
    createChatRoom,
    markNotificationAsReadById,
    router,
    handleAcceptNotification,
  };
};

export default useNotifications;
