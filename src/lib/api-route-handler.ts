import { ApiClient, ApiError, OpenAPI } from "@/src/lib/api-client";
import { getServerJwt } from "@/src/lib/supabase/supabase-server-jwt";
import { NextRequest, NextResponse } from "next/server";

type ApiRouteHandler<T = any> = (
  client: ApiClient,
  jwt: string,
  request: NextRequest
) => Promise<NextResponse<T>>;

export function withApiClient<T = any>(handler: ApiRouteHandler<T>) {
  return async (
    request: NextRequest,
    context?: { params?: { [key: string]: string | string[] } }
  ): Promise<NextResponse<T | { error: string }>> => {
    const jwt = await getServerJwt();

    if (!jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const client = new ApiClient({
        BASE: OpenAPI.BASE,
        TOKEN: async () => jwt,
      });
      return await handler(client, jwt, request);
    } catch (error) {
      if (error instanceof ApiError) {
        return NextResponse.json(error.body as { error: string }, {
          status: error.status,
        });
      }
      console.error("Unexpected error in API route:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
