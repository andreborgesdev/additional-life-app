import {
  ApiClient,
  CategoryResponse,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Define the context type for route parameters
type RouteContext = { params?: { id?: string | string[] | undefined } };

const getSubcategoriesHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CategoryResponse[] | { error: string }>> => {
  const parentIdFromParams = context.params?.id;

  if (!parentIdFromParams) {
    return NextResponse.json(
      { error: "Parent Category ID is required in path" },
      { status: 400 }
    );
  }

  const parentIdStr = Array.isArray(parentIdFromParams)
    ? parentIdFromParams[0]
    : parentIdFromParams;

  if (!parentIdStr) {
    return NextResponse.json(
      { error: "Parent Category ID is missing or invalid" },
      { status: 400 }
    );
  }

  const parentIdNumber = parseInt(parentIdStr, 10);
  if (isNaN(parentIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Parent Category ID format" },
      { status: 400 }
    );
  }

  try {
    const subcategories = await client.publicCategoryApi.getSubcategories(
      parentIdNumber
    );
    return NextResponse.json(subcategories);
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch subcategories";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withPublicApiClient(getSubcategoriesHandler);
