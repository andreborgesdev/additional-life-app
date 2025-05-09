import { UseItemsProps } from "@/src/hooks/use-items";
import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getItemsHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
  _context: { params?: { [key: string]: string | string[] } }
) => {
  const page = parseInt(_request.nextUrl.searchParams.get("page") || "0", 10);
  const size = parseInt(_request.nextUrl.searchParams.get("size") || "10", 10);
  const sortBy = _request.nextUrl.searchParams.get("sortBy") || "postedOn";
  const direction = _request.nextUrl.searchParams.get("direction") || "desc";

  // Call Spring Boot using OpenAPI client
  const result = await client.itemApi.getAllItems(
    page,
    size,
    sortBy,
    direction
  );

  return NextResponse.json(result);
};

export const GET = withApiClient(getItemsHandler);
