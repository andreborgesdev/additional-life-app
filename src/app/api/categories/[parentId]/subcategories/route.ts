import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { CategoryDto } from "@/src/lib/api-client"; // Assuming CategoryDto is the response type for a list of categories

export const dynamic = "force-dynamic";

// Define the context type for route parameters
type RouteContext = { params?: { parentId?: string | string[] | undefined } };

const getSubcategoriesHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CategoryDto[] | { error: string }>> => {
  const parentIdFromParams = context.params?.parentId;

  if (!parentIdFromParams) {
    return NextResponse.json({ error: "Parent Category ID is required in path" }, { status: 400 });
  }

  const parentIdStr = Array.isArray(parentIdFromParams) ? parentIdFromParams[0] : parentIdFromParams;

  if (!parentIdStr) {
    return NextResponse.json({ error: "Parent Category ID is missing or invalid" }, { status: 400 });
  }

  const parentIdNumber = parseInt(parentIdStr, 10);
  if (isNaN(parentIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Parent Category ID format" },
      { status: 400 }
    );
  }

  try {
    // Ensure your client.categoryApi has a method like getSubcategoriesByParentId or similar
    // based on the operationId: getSubcategories
    const subcategories = await client.categoryApi.getSubcategories(parentIdNumber);
    return NextResponse.json(subcategories);
  } catch (error: any) {
    console.error("Error fetching subcategories:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch subcategories";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getSubcategoriesHandler);
