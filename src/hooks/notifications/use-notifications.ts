"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/src/app/auth-provider";
import { useNotificationContext } from "@/src/contexts/notication-context";
import { useCallback, useMemo } from "react";
import { Notification } from "@/src/lib/generated-api";
import { ChatNotification } from "@/src/types/chat";

const NOTIFICATIONS_QUERY_KEY = "notifications";
const STALE_TIME = 30 * 1000;

export interface SystemNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  read: boolean;
  metadata?: {
    [key: string]: any;
  };
}

export interface UnifiedNotification extends SystemNotification {
  isChat?: boolean;
  chatData?: ChatNotification;
}

const fetchNotificationsByUserId = async (
  userId: string,
  accessToken: string
): Promise<SystemNotification[]> => {
  const response = await fetch(`/api/notifications/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch notifications: ${response.statusText}`);
  }

  const rawNotifications: Notification[] = await response.json();

  return rawNotifications.map((notif, index) => ({
    id: `system-${index}`,
    type: "SYSTEM",
    title: "System Notification",
    message: notif.message || "",
    userId: notif.recipientId || "",
    createdAt: notif.timestamp
      ? new Date(notif.timestamp).toISOString()
      : new Date().toISOString(),
    updatedAt: notif.timestamp
      ? new Date(notif.timestamp).toISOString()
      : new Date().toISOString(),
    read: false,
    metadata: {
      relatedItemId: notif.relatedItemId,
    },
  }));
};

const markNotificationAsRead = async (
  notificationId: string,
  accessToken: string
): Promise<void> => {
  const response = await fetch(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(
      `Failed to mark notification as read: ${response.statusText}`
    );
  }
};

const deleteNotificationById = async (
  notificationId: string,
  accessToken: string
): Promise<void> => {
  const response = await fetch(`/api/notifications/${notificationId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete notification: ${response.statusText}`);
  }
};

export const useNotifications = () => {
  const { session } = useSession();
  const { notifications: chatNotifications } = useNotificationContext();
  const queryClient = useQueryClient();

  const {
    data: systemNotifications = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [NOTIFICATIONS_QUERY_KEY, session?.user?.id],
    queryFn: () => {
      if (!session?.user?.id || !session?.access_token) {
        throw new Error("User session required");
      }
      return fetchNotificationsByUserId(session.user.id, session.access_token);
    },
    enabled: Boolean(session?.user?.id && session?.access_token),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const convertChatToNotification = useCallback(
    (chatNotification: ChatNotification): UnifiedNotification => {
      return {
        id: `chat-${chatNotification.id}`,
        type: "CHAT",
        title: `New message from ${chatNotification.fromUserName}`,
        message: chatNotification.lastMessage,
        userId: session?.user?.id || "",
        createdAt: chatNotification.timestamp,
        updatedAt: chatNotification.timestamp,
        read: chatNotification.unreadCount === 0,
        metadata: {
          itemId: chatNotification.itemId,
          fromUserId: chatNotification.fromUserId,
          fromUserName: chatNotification.fromUserName,
          link: `/chat?item=${chatNotification.itemId}&user=${chatNotification.fromUserId}`,
        },
        isChat: true,
        chatData: chatNotification,
      };
    },
    [session?.user?.id]
  );

  const unifiedNotifications = useMemo(() => {
    const chatNotifs = chatNotifications.map(convertChatToNotification);
    const systemNotifs = systemNotifications.map((notif) => ({
      ...notif,
      isChat: false as const,
    }));

    return [...chatNotifs, ...systemNotifs].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [chatNotifications, systemNotifications, convertChatToNotification]);

  const unreadCount = useMemo(() => {
    return unifiedNotifications.filter((notif) => !notif.read).length;
  }, [unifiedNotifications]);

  const deleteNotificationMutation = useMutation({
    mutationFn: async (notificationId: string) => {
      if (!session?.access_token) {
        throw new Error("Authentication required");
      }

      if (notificationId.startsWith("chat-")) {
        return;
      }

      await deleteNotificationById(notificationId, session.access_token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_QUERY_KEY] });
    },
  });

  return {
    notifications: unifiedNotifications,
    systemNotifications,
    chatNotifications,
    unreadCount,
    isLoading,
    error,
    refetch,
    deleteNotification: deleteNotificationMutation.mutate,
    isDeleting: deleteNotificationMutation.isPending,
  };
};
