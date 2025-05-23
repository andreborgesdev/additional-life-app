import { ApiClient, withApiClient, ItemResponse } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getUserItemsHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest
) => {
  try {
    const items = await client.itemApi.getUserItems();
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching user items:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch user items" },
      { status: error.status || 500 }
    );
  }
};

export const GET = withApiClient<ItemResponse[] | { message: string }>(
  getUserItemsHandler
);
