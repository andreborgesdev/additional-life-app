import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

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

const getChatNotificationsHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
): Promise<NextResponse<ChatNotification[] | { error: string }>> => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/chat/notifications`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const notifications: ChatNotification[] = await response.json();
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error("Error fetching chat notifications:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch chat notifications";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getChatNotificationsHandler);
