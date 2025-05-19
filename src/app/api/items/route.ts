import {
  ApiClient,
  withApiClient,
  ItemRequest,
  ItemResponse,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { ItemSearchRequest } from "@/src/lib/api-client";

// Ensure dynamic behavior for SSR JWT handling
export const dynamic = "force-dynamic";

const getItemsHandler = async (client: ApiClient, _request: NextRequest) => {
  const url = _request.nextUrl;
  const query = url.searchParams.get("query") || undefined;
  const category = url.searchParams.get("category") || undefined;
  const condition = url.searchParams.get("condition") || undefined;
  const page = parseInt(url.searchParams.get("page") || "0", 10);
  const size = parseInt(url.searchParams.get("size") || "10", 10);
  const sortBy = url.searchParams.get("sortBy") || "createdAt";
  const direction = url.searchParams.get("direction") || "desc";

  console.log(
    "GET items" +
      ` page: ${page}, size: ${size}, sortBy: ${sortBy}, direction: ${direction} ` +
      `query: ${query}, category: ${category}, condition: ${condition}`
  );

  const items = await client.publicItemApi.getItems(
    query,
    category,
    condition,
    sortBy,
    direction as ItemSearchRequest.sortDirection,
    page,
    size
  );
  return NextResponse.json(items);
};

const postItemHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest
) => {
  const body: ItemRequest = await request.json();

  const item: ItemRequest = {
    title: body.title,
    description: body.description,
    condition: body.condition as ItemRequest.condition,
    address: body.address,
    categoryId: body.categoryId,
    pickupPossible: body.pickupPossible,
    shippingPossible: body.shippingPossible,
    imageUrls: body.imageUrls,
  };

  const created = await client.itemApi.createItem(item);
  return NextResponse.json(created, { status: 201 });
};

export const GET = withPublicApiClient(getItemsHandler);
export const POST = withApiClient<ItemResponse | { message: string }>(
  postItemHandler
);
