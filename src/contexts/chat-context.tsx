"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "@/src/app/auth-provider";

export interface ChatNotification {
  id: string;
  itemId: string;
  fromUserId: string;
  fromUserName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

interface ChatContextType {
  notifications: ChatNotification[];
  unreadCount: number;
  isLoading: boolean;
  refreshNotifications: () => Promise<void>;
  markChatAsRead: (itemId: string, otherUserId: string) => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { session } = useSession();
  const [notifications, setNotifications] = useState<ChatNotification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshNotifications = async () => {
    if (!session?.access_token) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/chat/notifications", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      if (response.ok) {
        const data: ChatNotification[] = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch chat notifications:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const markChatAsRead = async (itemId: string, otherUserId: string) => {
    if (!session?.access_token) return;

    try {
      await fetch("/api/chat/mark-read", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ itemId, otherUserId }),
      });

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.fromUserId === otherUserId &&
          notification.itemId === itemId
            ? { ...notification, unreadCount: 0 }
            : notification
        )
      );
    } catch (error) {
      console.error("Failed to mark chat as read:", error);
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
    <ChatContext.Provider
      value={{
        notifications,
        unreadCount,
        isLoading,
        refreshNotifications,
        markChatAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
