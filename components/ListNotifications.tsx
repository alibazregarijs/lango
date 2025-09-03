import { type Message } from "@/types";
import { Id } from "@/convex/_generated/dataModel";
import Image from "next/image";
import { formatDate } from "@/utils";
import { Button } from "./ui/button";

export const ListNotifications = ({
  unreadNotifications,
  handleReadNotification,
  closeModal,
  handleAcceptNotification,
}: {
  unreadNotifications: Message[];
  handleReadNotification: (notificationId: Id<"notifications">) => void;
  closeModal: () => void;
  handleAcceptNotification: (
    notificationId: Id<"notifications">,
    routeUrl: string,
    userTakerId: string,
    userSenderId: string,
    userSenderImageUrl: string,
    closeModal: () => void
  ) => void;
}) => {
  return (
    <div className="overflow-y-auto max-h-64 custom-scrollbar">  
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
                      onClick={() => handleReadNotification(notification._id)}
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
                        handleAcceptNotification(
                          notification._id,
                          notification.routeUrl!,
                          notification.userTakerId!,
                          notification.userSenderId!,
                          notification.userSenderImageUrl!,
                          closeModal!
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
        <div className="p-6 text-center text-gray-1">No notifications</div>
      )}
    </div>
  );
};
