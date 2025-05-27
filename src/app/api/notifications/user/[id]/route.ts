import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { Notification } from "@/src/lib/generated-api";

export const dynamic = "force-dynamic";

interface ChatNotification {
  id: string;
  itemId: string;
  fromUserId: string;
  fromUserName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

const generateChatId = (
  itemId: string,
  userId1: string,
  userId2: string
): string => {
  const sortedUserIds = [userId1, userId2].sort();
  return `${itemId}-${sortedUserIds[0]}-${sortedUserIds[1]}`;
};

const getNotificationsByUserIdHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } } = {}
): Promise<NextResponse<ChatNotification[] | { error: string }>> => {
  try {
    const userId = context.params?.id as string;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const notifications: Notification[] =
      await client.notificationController.getNotificationsByUserId(userId);

    const chatNotifications: ChatNotification[] = await Promise.all(
      notifications.map(async (notification) => {
        const chatId = generateChatId(
          notification.relatedItemId || "",
          userId,
          notification.recipientId || ""
        );

        let fromUserName = "Unknown User";
        let unreadCount = 1;

        try {
          if (notification.recipientId) {
            const userResponse = await client.userApi.getUserById(
              notification.recipientId
            );
            fromUserName =
              userResponse.name || userResponse.email || "Unknown User";
          }
        } catch (userError) {
          console.warn(
            `Failed to fetch user name for ${notification.recipientId}:`,
            userError
          );
        }

        try {
          unreadCount = await client.chatController.getUnreadChatCount(
            chatId,
            userId
          );
        } catch (countError) {
          console.warn(
            `Failed to fetch unread count for chat ${chatId}:`,
            countError
          );
        }

        return {
          id: chatId,
          itemId: notification.relatedItemId || "",
          fromUserId: notification.recipientId || "",
          fromUserName,
          lastMessage: notification.message || "",
          timestamp: notification.timestamp
            ? new Date(notification.timestamp).toISOString()
            : new Date().toISOString(),
          unreadCount,
        };
      })
    );

    return NextResponse.json(chatNotifications);
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch notifications";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getNotificationsByUserIdHandler);
