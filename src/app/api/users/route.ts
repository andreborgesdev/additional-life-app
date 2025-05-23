import { NextRequest, NextResponse } from "next/server";
import { ApiClient, UserResponse } from "@/src/lib/generated-api";
import { withApiClient, withPublicApiClient } from "@/src/lib/api-client";

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

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withApiClient(getUserByEmailHandler);
