import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { UserChatListResponse } from "@/src/lib/generated-api";

export const dynamic = "force-dynamic";

interface RouteContext {
  params?: { [key: string]: string | string[] };
}

const getUserChatsListHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: RouteContext = {}
): Promise<NextResponse<UserChatListResponse[] | { error: string }>> => {
  try {
    const userId = context.params?.userId as string;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const chats: UserChatListResponse[] =
      await client.chatController.getUserChatsList(userId);

    return NextResponse.json(chats);
  } catch (error: any) {
    console.error("Error fetching user chats list:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch user chats";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getUserChatsListHandler);
