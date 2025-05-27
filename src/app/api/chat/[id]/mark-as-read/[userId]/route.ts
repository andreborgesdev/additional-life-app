import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const markChatAsReadHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } } = {}
): Promise<NextResponse> => {
  try {
    const chatId = context.params?.id as string;
    const userId = context.params?.userId as string;

    if (!chatId || !userId) {
      return NextResponse.json(
        { error: "Chat ID and User ID are required" },
        { status: 400 }
      );
    }

    await client.chatController.markChatAsRead(chatId, userId);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error marking chat as read:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to mark chat as read";
    return NextResponse.json({ error: message }, { status });
  }
};

export const PUT = withApiClient(markChatAsReadHandler);
