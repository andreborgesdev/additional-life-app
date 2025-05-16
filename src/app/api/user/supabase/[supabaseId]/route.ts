export const dynamic = "force-dynamic";

import { ApiClient, withPublicApiClient } from "@/src/lib/api-client";
import { UserResponse } from "@/src/lib/generated-api";
import { NextRequest, NextResponse } from "next/server";

type RouteContext = {
  params?: { [key: string]: string | string[] | undefined };
};

const getUserBySupabaseIdHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<UserResponse | { error: string }>> => {
  const supabaseIdFromParams = context.params?.supabaseId;

  if (!supabaseIdFromParams) {
    return NextResponse.json(
      { error: "Supabase ID is required" },
      { status: 400 }
    );
  }

  const supabaseId = Array.isArray(supabaseIdFromParams)
    ? supabaseIdFromParams[0]
    : supabaseIdFromParams;

  if (!supabaseId) {
    return NextResponse.json(
      { error: "Supabase ID is missing or invalid" },
      { status: 400 }
    );
  }

  try {
    const result: UserResponse = await client.userApi.getUserBySupabaseId(
      supabaseId
    );
    return NextResponse.json(result);
  } catch (error: any) {
    console.error("Error fetching user by Supabase ID:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to fetch user by Supabase ID";
    return NextResponse.json({ error: message }, { status });
  }
};

export const GET = withPublicApiClient(getUserBySupabaseIdHandler);
