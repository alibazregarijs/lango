import React from "react";
import { ListNotifications } from "@/components/ListNotifications";
import { NotificationIcon } from "@/components/ui/NotificationIcon";
import useNotifications from "@/hooks/useNotifications";
import { type Message } from "@/types";
import useNotificationsModal from "@/hooks/useNotificationsModal";

const Notification = () => {
  const {
    unreadNotifications,
    notificationCount,
    hasUnreadNotifications,
    markAllAsRead,
    handleAcceptNotification,
    handleReadNotification,
  } = useNotifications();

  const { isOpen, toggleModal, closeModal } = useNotificationsModal();

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
            <ListNotifications
              unreadNotifications={unreadNotifications as Message[]}
              handleReadNotification={handleReadNotification}
              closeModal={closeModal}
              handleAcceptNotification={handleAcceptNotification}
            />
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
