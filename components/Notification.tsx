import React, { useState } from 'react';
import { useUser } from "@/context/UserContext";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";

const Notification = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New message from Alex', time: '2 min ago', read: false },
    { id: 2, text: 'Your document is ready', time: '15 min ago', read: true },
    { id: 3, text: 'Meeting starts in 30 minutes', time: '1 hour ago', read: true },
  ]);
  
  const { userId } = useUser();

  const unreadNotifications = useQuery(api.Notifications.getUnreadByUser, { userId: userId! });

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark all as read when opening
    if (!isOpen && notificationCount > 0) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
      setNotificationCount(0);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const NotificationIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="#F97535"/>
    </svg>
  );

  return (
    <>
      {/* Notification Icon with Badge */}
      <div 
        className="relative p-2 rounded-full cursor-pointer hover:bg-black-5 transition-colors duration-200"
        onClick={toggleNotifications}
      >
        <NotificationIcon />
        {notificationCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {notificationCount}
          </span>
        )}
      </div>

      {/* Notification Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black-3 bg-opacity-80">
          <div className="relative w-full max-w-md bg-black-2 rounded-xl shadow-lg border border-black-5">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-black-5">
              <h3 className="font-semibold text-white">Notifications</h3>
              <div className="flex items-center gap-2">
                <button 
                  className="text-sm text-orange-1 hover:text-orange-300 transition-colors"
                  onClick={() => {
                    setNotifications(notifications.map(n => ({ ...n, read: true })));
                    setNotificationCount(0);
                  }}
                >
                  Mark all as read
                </button>
                <button 
                  onClick={closeModal}
                  className="ml-2 text-gray-400 hover:text-white transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Notification List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div 
                    key={notification.id} 
                    className={`flex items-start p-4 border-b border-black-5 last:border-b-0 ${
                      !notification.read ? 'bg-black-6' : 'hover:bg-black-5'
                    } transition-colors duration-200`}
                  >
                    <div className="flex-1">
                      <p className="text-sm text-white">{notification.text}</p>
                      <span className="text-xs text-gray-1">{notification.time}</span>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-orange-1 rounded-full ml-2 mt-2"></div>
                    )}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-1">No notifications</div>
              )}
            </div>
            
            {/* Footer */}
            <div className="p-3 border-t border-black-5 text-center">
              <button className="text-sm text-orange-1 hover:text-orange-300 font-medium transition-colors">
                View All Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Notification;