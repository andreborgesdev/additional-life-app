import { ApiClient } from "@/src/lib/api-client";
import { withApiClient } from "@/src/lib/api-route-handler";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getItemsHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest // request can be used if needed, e.g., for query params
) => {
  // Pagination parameters
  const page = 0; // Consider getting these from request.nextUrl.searchParams
  const size = 10;
  const sortBy = "postedOn";
  const direction = "desc";

  // Call Spring Boot using OpenAPI client
  const result = await client.default.getApiV1Items({
    page,
    size,
    sortBy,
    direction,
  });

  return NextResponse.json(result);
};

export const GET = withApiClient(getItemsHandler);
