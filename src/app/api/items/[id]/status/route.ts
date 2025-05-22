import {
  ApiClient,
  withApiClient,
  ItemResponse,
  ItemStatusRequest,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params?: { [key: string]: string | string[] | undefined };
};

const changeItemStatusHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ItemResponse | { error: string }>> => {
  const idFromParams = context.params?.id;

  if (!idFromParams) {
    return NextResponse.json(
      { error: "Item ID is required in path" },
      { status: 400 }
    );
  }
  const idStr = Array.isArray(idFromParams) ? idFromParams[0] : idFromParams;

  if (!idStr) {
    return NextResponse.json(
      { error: "Item ID is missing or invalid" },
      { status: 400 }
    );
  }

  try {
    const requestBody: ItemStatusRequest = await request.json();
    if (!requestBody || !requestBody.status) {
      return NextResponse.json(
        { error: "Status is required in request body" },
        { status: 400 }
      );
    }

    const updatedItem: ItemResponse = await client.itemApi.changeItemStatus(
      idStr,
      requestBody
    );
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error("Error changing item status:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to change item status";
    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = withApiClient(changeItemStatusHandler);
