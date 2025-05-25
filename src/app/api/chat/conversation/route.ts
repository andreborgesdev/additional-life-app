import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getConversationHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
): Promise<NextResponse<{ conversationId: string } | { error: string }>> => {
  const { searchParams } = new URL(request.url);
  const itemId = searchParams.get("itemId");
  const currentUser = searchParams.get("currentUser");
  const otherUser = searchParams.get("otherUser");

  if (!itemId || !currentUser || !otherUser) {
    return NextResponse.json(
      { error: "itemId, currentUser, and otherUser are required" },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${process.env.API_URL}/api/v1/chat/history?itemId=${itemId}&currentUser=${currentUser}&otherUser=${otherUser}`,
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

    const messages = await response.json();

    // Extract conversationId from the first message, or generate one if no messages exist
    let conversationId = null;
    if (messages.length > 0) {
      conversationId = messages[0].conversationId;
    }

    if (!conversationId) {
      // If no conversation exists, we need to create one by making a request to the backend
      // This would typically happen when starting a new conversation
      conversationId = `${itemId}-${currentUser}-${otherUser}`;
    }

    return NextResponse.json({ conversationId });
  } catch (error: any) {
    console.error("Error getting conversation:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to get conversation";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getConversationHandler);
