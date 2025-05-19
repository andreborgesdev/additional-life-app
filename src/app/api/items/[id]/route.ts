import {
  ApiClient,
  withApiClient,
  ItemResponse,
  ItemRequest,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Common type for context provided by Next.js to route handlers in dynamic segments
type RouteContext = {
  params?: { [key: string]: string | string[] | undefined };
};

const getItemByIdHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<ItemResponse | { error: string }>> => {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
  }

  try {
    const result: ItemResponse = await client.publicItemApi.getItemById(id);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching item by ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch item";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withPublicApiClient(getItemByIdHandler);

const updateItemHandler = async (
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

  const itemIdNumber = parseInt(idStr, 10);
  if (isNaN(itemIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Item ID format" },
      { status: 400 }
    );
  }

  try {
    const body = await request.json();
    const itemData: ItemRequest = body as ItemRequest; // Assuming body is already validated or ItemRequest is flexible
    const updatedItem: ItemResponse = await client.itemApi.updateItem(
      itemIdNumber,
      itemData
    );
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error("Error updating item:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to update item";
    return NextResponse.json({ error: message }, { status });
  }
};

export const PUT = withApiClient(updateItemHandler);

const deleteItemHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<{ message?: string; error?: string }>> => {
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

  const itemIdNumber = parseInt(idStr, 10);
  if (isNaN(itemIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Item ID format" },
      { status: 400 }
    );
  }

  try {
    await client.itemApi.deleteItem(itemIdNumber);
    return NextResponse.json({}, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to delete item";
    return NextResponse.json({ error: message }, { status });
  }
};

export const DELETE = withApiClient(deleteItemHandler);
