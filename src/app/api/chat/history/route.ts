import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ChatMessage {
  id: string;
  itemId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  timestamp: string;
}

const getChatHistoryHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
): Promise<NextResponse<ChatMessage[] | { error: string }>> => {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  const otherUserId = searchParams.get("otherUserId");

  if (!itemId || !otherUserId) {
    return NextResponse.json(
      { error: "itemId and otherUserId are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/chat/history?itemId=${itemId}&otherUserId=${otherUserId}`,
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

    const messages: ChatMessage[] = await response.json();
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch chat history";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getChatHistoryHandler);
