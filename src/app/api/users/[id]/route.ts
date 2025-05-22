import {
  ApiClient,
  UserRequest,
  UserResponse,
  withApiClient,
  withPublicApiClient,
} from "@/src/lib/api-client";
import { useSupabaseServer } from "@/src/lib/supabase/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type RouteContext = {
  params?: { id?: string | string[] };
};

const getUserByIdHandler = async (
  client: ApiClient,
  _request: NextRequest,
  context: RouteContext
): Promise<NextResponse<UserResponse | { error: string }>> => {
  const idFromParams = context.params?.id;

  if (!idFromParams) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
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

const updateUserHandler = async (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: RouteContext
): Promise<NextResponse<UserResponse | { error: string }>> => {
  const supabase = await useSupabaseServer();
  const idFromParams = context.params?.id;

  if (!idFromParams) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }
  const userId = Array.isArray(idFromParams) ? idFromParams[0] : idFromParams;

  if (!userId) {
    return NextResponse.json(
      { error: "User ID is missing or invalid" },
      { status: 400 }
    );
  }

  let userData: UserRequest;
  try {
    userData = await request.json();
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  try {
    const updatedUserInDb: UserResponse = await client.userApi.updateUser(
      userId,
      userData
    );

    console.log("Updated user in DB successfully:", updatedUserInDb);

    if (updatedUserInDb) {
      const { error: authError } = await supabase.auth.updateUser({
        data: {
          user_id: updatedUserInDb.id,
          name: userData.name,
          avatar_url: userData.avatarUrl,
          address: userData.address,
          bio: userData.bio,
          preferred_language: userData.preferredLanguage,
        },
      });

      if (authError) {
        console.error("Error updating Supabase auth user metadata:", authError);
      }

      console.log(
        "Updated Supabase user metadata successfully:",
        updatedUserInDb.supabaseId
      );
    }

    return NextResponse.json(updatedUserInDb);
  } catch (error: any) {
    console.error("Error updating user:", error);
    const status = typeof error.status === "number" ? error.status : 500;
    const message = error.message || "Failed to update user";
    return NextResponse.json({ error: message }, { status });
  }
};

export const PUT = withApiClient(updateUserHandler);
