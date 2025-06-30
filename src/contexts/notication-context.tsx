"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import { useSession } from "@/src/app/auth-provider";
import { ChatNotification, NotificationEvent } from "@/src/types/chat";
import { createNotificationApiService } from "../services/notification-api.service";
import { useNotificationsWebSocket } from "@/src/hooks/use-notifications-websocket";

interface NotificationContextType {
  notifications: ChatNotification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  isWebSocketConnected: boolean;
  isWebSocketConnecting: boolean;
  webSocketError: string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export function NotificationProvider({
  children,
  websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL ||
    "http://localhost:8080/ws",
}: {
  children: React.ReactNode;
  websocketUrl?: string;
}) {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const notificationApiService = useMemo(
    () => createNotificationApiService(() => session?.access_token || null),
    [session?.access_token]
  );

  const refreshNotifications = useCallback(async () => {
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
  }, [session?.user?.id, notificationApiService]);

  const handleWebSocketNotification = useCallback(
    (notification: NotificationEvent) => {
      console.log("🔔 Real-time notification received:", notification);

      // Show browser notification
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/favicon.ico",
          tag: notification.id,
        });
      }

      // Refresh notifications from API to get updated data
      refreshNotifications();
    },
    [refreshNotifications]
  );

  const handleWebSocketError = useCallback((error: Event) => {
    console.error("🔔 Notifications WebSocket error:", error);
  }, []);

  const handleWebSocketOpen = useCallback(() => {
    console.log("🔔 Notifications WebSocket connected");
  }, []);

  const handleWebSocketClose = useCallback(() => {
    console.log("🔔 Notifications WebSocket disconnected");
  }, []);

  // WebSocket connection for real-time notifications
  const {
    isConnected: isWebSocketConnected,
    isConnecting: isWebSocketConnecting,
    error: webSocketError,
  } = useNotificationsWebSocket({
    url: websocketUrl,
    onNotification: handleWebSocketNotification,
    onError: handleWebSocketError,
    onOpen: handleWebSocketOpen,
    onClose: handleWebSocketClose,
    enabled: Boolean(session?.access_token),
  });

  const unreadCount = notifications.reduce(
    (total, notification) => total + notification.unreadCount,
    0
  );

  // Initial load of notifications
  useEffect(() => {
    if (session?.access_token) {
      refreshNotifications();
    }
  }, [session?.access_token, refreshNotifications]);

  // Request browser notification permission
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("🔔 Notification permission:", permission);
      });
    }
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
        isWebSocketConnected,
        isWebSocketConnecting,
        webSocketError,
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
