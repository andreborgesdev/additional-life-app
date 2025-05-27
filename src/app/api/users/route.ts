import { NextRequest, NextResponse } from "next/server";
import { ApiClient, ApiError } from "@/src/lib/generated-api";
import { withApiClient } from "@/src/lib/api-client";

type RouteContext = {
  params?: { id?: string | string[] };
};

export async function getUserByEmailHandler(
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email parameter is required" },
        { status: 400 }
      );
    }

    const user = await client.userApi.getUserByEmail(email);
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user by email:", error);

    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          message:
            error.body?.detail || error.message || `API Error: ${error.status}`,
        },
        { status: error.status }
      );
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withApiClient(getUserByEmailHandler);
