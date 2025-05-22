import {
  ApiClient,
  UserRequest,
  UserResponse,
  withApiClient,
} from "@/src/lib/api-client";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params?: { id?: string | string[] };
};

async function updateUserHandler(
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<UserResponse | { error: string }>> {
  const idFromParams = context.params?.id;

  if (!idFromParams) {
    return NextResponse.json(
      { error: "User ID is required in path" },
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
    const body = await request.json();
    const userData: UserRequest = body as UserRequest;

    const updatedUser: UserResponse = await client.userApi.updateUser(
      userId,
      userData
    );
    return NextResponse.json(updatedUser);
  } catch (error: any) {
    console.error(`Error updating user ${userId}:`, error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to update user";
    return NextResponse.json({ error: message }, { status });
  }
}

export const PUT = withApiClient(updateUserHandler);
