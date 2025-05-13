import {
  ApiClient,
  withApiClient,
  ItemRequest,
  ItemResponse,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

// Ensure dynamic behavior for SSR JWT handling
export const dynamic = "force-dynamic";

const getItemsHandler = async (client: ApiClient, _request: NextRequest) => {
  const url = _request.nextUrl;
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10);
  const sortBy = url.searchParams.get("sortBy") || "postedOn";
  const direction = url.searchParams.get("direction") || "desc";

  const items = await client.publicItemApi.getItems(
    page,
    size,
    sortBy,
    direction
  );
  return NextResponse.json(items);
};

const postItemHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
) => {
  const body = await request.json();

  // Type safety: validate shape if needed
  const item: ItemRequest = {
    title: body.title,
    description: body.description,
    address: body.address,
    categoryId: body.categoryId,
    itemType: body.itemType || "INTERNAL",
    imageUrl: body.imageUrl,
    pickupInstructions: body.pickupInstructions,
    conditionDescription: body.conditionDescription,
    externalUrl: body.externalUrl,
  };

  const created = await client.itemApi.createItem(item);
  return NextResponse.json(created, { status: 201 });
};

export const GET = withPublicApiClient(getItemsHandler);
export const POST = withApiClient<ItemResponse | { message: string }>(
  postItemHandler
);
