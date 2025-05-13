import {
  ApiClient,
  withApiClient,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { CategoryDto } from "@/src/lib/api-client"; // Assuming CategoryDto is the response type

export const dynamic = "force-dynamic";

const getRootCategoriesHandler = async (
  client: ApiClient,
  _request: NextRequest
): Promise<NextResponse<CategoryDto[] | { error: string }>> => {
  try {
    // Assuming your client.categoryApi has a method like getRootCategories.
    // The OpenAPI spec does not explicitly define an operationId for this path,
    // so you might need to verify/adjust the method name based on your generated ApiClient.
    const rootCategories = await client.publicCategoryApi.getRootCategories(); // Or a similar method name
    return NextResponse.json(rootCategories);
  } catch (error: any) {
    console.error("Failed to fetch root categories:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch root categories" },
      { status: error.status || 500 }
    );
  }
};

export const GET = withPublicApiClient(getRootCategoriesHandler);
