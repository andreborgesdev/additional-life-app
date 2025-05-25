import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const markChatAsReadHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
): Promise<NextResponse<{ success: boolean } | { error: string }>> => {
  try {
    const { itemId, otherUserId } = await request.json();

    if (!itemId || !otherUserId) {
      return NextResponse.json(
        { error: "itemId and otherUserId are required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${process.env.API_URL}/api/v1/chat/mark-read`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId, otherUserId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error marking chat as read:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to mark chat as read";
    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = withApiClient(markChatAsReadHandler);
