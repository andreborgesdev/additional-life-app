import { ApiClient, withApiClient, ItemResponse } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params?: { [key: string]: string | string[] | undefined };
};

const markItemAsTakenHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
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
    const updatedItem: ItemResponse = await client.itemApi.markItemAsTaken(
      idStr
    );
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error("Error marking item as taken:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to mark item as taken";
    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = withApiClient(markItemAsTakenHandler);
