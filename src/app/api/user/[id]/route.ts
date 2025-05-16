export const dynamic = "force-dynamic";

import {
  ApiClient,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { UserResponse } from "@/src/lib/generated-api";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params?: { [key: string]: string | string[] | undefined };
};

const getUserByIdHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<UserResponse | { error: string }>> => {
  const idFromParams = context.params?.id;

  if (!idFromParams) {
    return NextResponse.json(
      { error: "User ID is required" },
      { status: 400 }
    );
  }

  const userId = Array.isArray(idFromParams) ? idFromParams[0] : idFromParams;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is missing or invalid" },
      { status: 400 }
    );
  }

  try {
    const result: UserResponse = await client.userApi.getUserById(userId);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching user by ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch user";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withPublicApiClient(getUserByIdHandler);

