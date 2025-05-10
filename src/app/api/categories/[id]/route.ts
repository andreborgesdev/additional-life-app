import { ApiClient, withApiClient } from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";
import { CategoryDto } from "@/src/lib/api-client"; // Assuming CategoryDto is the response type

export const dynamic = "force-dynamic";

type RouteContext = { params?: { id?: string | string[] | undefined } };

const getCategoryByIdHandler = async (
  client: ApiClient,
  jwt: string,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CategoryDto | { error: string }>> => {
  const idFromParams = context.params?.id;
  if (!idFromParams) {
    return NextResponse.json({ error: "Category ID is required in path" }, { status: 400 });
  }
  const idStr = Array.isArray(idFromParams) ? idFromParams[0] : idFromParams;

  if (!idStr) {
    return NextResponse.json({ error: "Category ID is missing or invalid" }, { status: 400 });
  }

  const categoryIdNumber = parseInt(idStr, 10);
  if (isNaN(categoryIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Category ID format" },
      { status: 400 }
    );
  }

  try {
    // Assuming your client.categoryApi has a method like getCategoryById
    // The operationId in the OpenAPI spec is not explicitly defined for GET /api/v1/categories/{id},
    // but typically it would be something like 'getCategoryById'.
    // Please verify the actual method name in your generated ApiClient.
    const category = await client.categoryApi.getCategoryById(categoryIdNumber);
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Error fetching category by ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch category";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withApiClient(getCategoryByIdHandler);
