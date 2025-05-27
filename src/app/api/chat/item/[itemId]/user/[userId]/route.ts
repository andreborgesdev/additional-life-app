import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getChatIdByItemIdAndUserIdHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } }
): Promise<NextResponse<string | { error: string }>> => {
  const { params } = context;

  if (!params) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const itemId = Array.isArray(params.itemId)
    ? params.itemId[0]
    : params.itemId;
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId;

  if (!itemId || !userId) {
    return NextResponse.json(
      { error: "itemId and userId are required" },
      { status: 400 }
    );
  }

  try {
    const chatId = await client.chatController.getChatIdByItemIdAndUserId(
      itemId,
      userId
    );

    return NextResponse.json(chatId);
  } catch (error: any) {
    console.error("Error getting chat ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to get chat ID";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getChatIdByItemIdAndUserIdHandler);
