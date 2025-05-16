import {
  ApiClient,
  CategoryResponse,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = { params?: { id?: string | string[] | undefined } };

const getCategoryByIdHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<CategoryResponse | { error: string }>> => {
  const { id } = context.params;

  if (!id) {
    return NextResponse.json(
      { error: "Category ID is required in path" },
      { status: 400 }
    );
  }

  const categoryIdNumber = parseInt(id, 10);
  if (isNaN(categoryIdNumber)) {
    return NextResponse.json(
      { error: "Invalid Category ID format" },
      { status: 400 }
    );
  }

  try {
    const category = await client.publicCategoryApi.getCategoryById(
      categoryIdNumber
    );
    return NextResponse.json(category);
  } catch (error: any) {
    console.error("Error fetching category by ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch category";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withPublicApiClient(getCategoryByIdHandler);
