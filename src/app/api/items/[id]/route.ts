import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { ItemResponse } from "@/src/lib/api-client";

export const dynamic = "force-dynamic";

const getItemByIdHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
  context: { params: { id: string } }
): Promise<NextResponse<ItemResponse | { error: string }>> => {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  const itemIdNumber = parseInt(id, 10);
  if (isNaN(itemIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Item ID format" },
      { status: 400 }
    );
  }

  try {
    const result: ItemResponse = await client.itemApi.getItemById(itemIdNumber);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching item by ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch item";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getItemByIdHandler);
