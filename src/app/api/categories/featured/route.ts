import { ApiClient, withPublicApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getFeaturedCategoriesHandler = async (
  client: ApiClient,
  _request: NextRequest
) => {
  try {
    const categories = await client.publicCategoryApi.getFeaturedCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Failed to fetch featured categories:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch featured categories" },
      { status: error.status || 500 }
    );
  }
};

export const GET = withPublicApiClient(getFeaturedCategoriesHandler);
