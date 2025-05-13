import {
  ApiClient,
  withApiClient,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const getCategoriesHandler = async (
  client: ApiClient,
  _request: NextRequest
) => {
  try {
    const categories = await client.publicCategoryApi.getAllCategories();
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch categories" },
      { status: error.status || 500 }
    );
  }
};

export const GET = withPublicApiClient(getCategoriesHandler);
