import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getChatHistoryHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } } = {}
): Promise<NextResponse> => {
  try {
    const chatId = context.params?.id as string;

    if (!chatId) {
      return NextResponse.json(
        { error: "Chat ID is required" },
        { status: 400 }
      );
    }

    const messages = await client.chatController.getChatHistoryByChatId(chatId);
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Error fetching chat history:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch chat history";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getChatHistoryHandler);
