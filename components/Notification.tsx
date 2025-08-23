import React, { useState, useCallback, useMemo } from "react";
import { useUser } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { useQuery, useMutation } from "convex/react";
import Spinner from "./Spinner";
import { Button } from "./ui/button";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";
import { NotificationIcon } from "@/components/ui/NotificationIcon";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userId } = useUser();
  const router = useRouter();

  const unreadNotifications = useQuery(
    api.Notifications.getUnreadByUser,
    userId ? { userId } : "skip"
  );

  if (!userId) return <Spinner loading={true} />;

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
    if (!hasUnreadNotifications) return;

    try {
      await markNotificationsAsRead({ userId });
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast.error("Failed to mark notifications as read");
    }
  };

  const toggleModal = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleAcceptRequest = async (
    notificationId: Id<"notifications">,
    routeUrl: string,
    userTakerId: string,
    userSenderId: string
  ) => {
    try {
      console.log(userTakerId, userSenderId, "hereeeee");
      await acceptNotificationByUser({ notificationId });
      await createChatRoom({
        takerId: userTakerId as string,
        giverId: userSenderId as string,
      });
      toast.success("You have accepted the request.");
      router.push(
        `${routeUrl}?userSenderId=${userSenderId}&userTakerId=${userTakerId}`
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Error accepting notification:", error);
      toast.error("Failed to accept request");
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

  const formatDate = useCallback((timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  }, []);

  return (
    <>
      {/* Notification Icon with Badge */}
      <div
        className="relative p-2 rounded-full cursor-pointer hover:bg-black-5 transition-colors duration-200"
        onClick={toggleModal}
        role="button"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <NotificationIcon />
        {hasUnreadNotifications && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount > 99 ? "99+" : notificationCount}
          </span>
        )}
      </div>

      {/* Notification Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-3 bg-opacity-80"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-md bg-black-2 rounded-xl shadow-lg border border-black-5 max-h-96"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black-5">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                {hasUnreadNotifications && (
                  <button
                    className="text-sm text-orange-1 hover:text-orange-300 transition-colors"
                    onClick={markAllAsRead}
                    disabled={!hasUnreadNotifications}
                  >
                    Mark all as read
                  </button>
                )}
                <button
                  onClick={closeModal}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                  aria-label="Close notifications"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-64">
              {unreadNotifications && unreadNotifications.length > 0 ? (
                <div role="list">
                  {unreadNotifications.map((notification) => (
                    <div
                      key={notification._id}
                      role="listitem"
                      className={`flex items-start p-4 border-b border-black-5 last:border-b-0 ${
                        !notification.read ? "bg-black-6" : "hover:bg-black-5"
                      } transition-colors duration-200`}
                    >
                      {/* Sender Image */}
                      {notification.userSenderImageUrl && (
                        <div className="mr-3 flex-shrink-0">
                          <Image
                            src={notification.userSenderImageUrl}
                            alt="Sender"
                            width={40}
                            height={40}
                            className="rounded-full object-cover"
                          />
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div>
                          {/* Sender Name */}
                          <p className="text-sm font-medium text-white">
                            {notification.userSenderName || "Unknown User"}
                          </p>

                          {/* Notification Text */}
                          <p className="text-sm text-white break-words mt-1">
                            {notification.text}
                          </p>

                          {/* Timestamp */}
                          <span className="text-xs text-gray-1 block mt-1">
                            {formatDate(notification._creationTime)}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          {!notification.read && (
                            <Button
                              onClick={() =>
                                handleReadNotification(notification._id)
                              }
                              variant="outline"
                              size="sm"
                              className="cursor-pointer"
                            >
                              Mark as read
                            </Button>
                          )}
                          {notification.accept === false && (
                            <Button
                              onClick={() =>
                                handleAcceptRequest(
                                  notification._id,
                                  notification.routeUrl!,
                                  notification.userTakerId,
                                  notification.userSenderId
                                )
                              }
                              variant="default"
                              size="sm"
                              className="cursor-pointer bg-orange-1 hover:bg-orange-2 text-white"
                            >
                              Accept
                            </Button>
                          )}
                        </div>
                      </div>

                      {!notification.read && (
                        <div
                          className="w-2 h-2 bg-orange-1 rounded-full ml-2 mt-2 flex-shrink-0"
                          aria-label="Unread notification"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center text-gray-1">
                  No notifications
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-black-5 text-center text-sm text-gray-1">
              {hasUnreadNotifications && (
                <span>{notificationCount} unread notification(s)</span>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default React.memo(Notification);
