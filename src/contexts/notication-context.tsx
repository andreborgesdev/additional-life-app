"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";
import { useSession } from "@/src/app/auth-provider";
import { ChatNotification } from "@/src/types/chat";
import { createNotificationApiService } from "../services/notification-api.service";

interface NotificationContextType {
  notifications: ChatNotification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const notificationApiService = useMemo(
    () => createNotificationApiService(() => session?.access_token || null),
    [session?.access_token]
  );

  const refreshNotifications = async () => {
    if (!session?.user?.id) return;

    setIsLoading(true);
    try {
      const data = await notificationApiService.getNotifications(
        session.user.id
      );
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const unreadCount = notifications.reduce(
    (total, notification) => total + notification.unreadCount,
    0
  );

  useEffect(() => {
    if (session?.access_token) {
      refreshNotifications();

      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [session?.access_token]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
}
