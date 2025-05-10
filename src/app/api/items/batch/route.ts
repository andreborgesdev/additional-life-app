import { ApiClient, withApiClient, ItemRequest } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Assuming BatchItemRequest is an array of ItemRequest based on typical batch operations.
// You might need to define a specific BatchItemRequest type if it's different.
type BatchItemRequest = ItemRequest[];

const batchCreateItemsHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
): Promise<NextResponse<any | { error: string }>> => { // Adjust 'any' to the actual expected response type for batch creation, e.g., ItemResponse[]
  try {
    const body = await request.json();
    const items: BatchItemRequest = body as BatchItemRequest; // Add validation if necessary

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Request body must be a non-empty array of items" }, { status: 400 });
    }

    // Assuming your client.itemApi.batchCreateItems method exists and handles an array of items.
    // The actual method name and signature might vary based on your openapi-generator configuration.
    // For example, it might be client.itemApi.batchCreateItems({ requestBody: items })
    // or client.itemApi.batchCreateItems(items)
    // Please adjust the call below according to your generated ApiClient.
    const createdItems = await client.itemApi.batchCreateItems(items);
    return NextResponse.json(createdItems, { status: 201 });
  } catch (error: any) {
    console.error("Error batch creating items:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to batch create items";
    return NextResponse.json({ error: message }, { status });
  }
};

export const POST = withApiClient(batchCreateItemsHandler);
