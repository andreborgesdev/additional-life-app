import { NextRequest, NextResponse } from "next/server";
import { OpenAPI } from "./generated-api/core/OpenAPI";
import { getServerJwt } from "./supabase/supabase-server-jwt";
import { ApiClient, ApiError } from "./generated-api";

// Re-export all services, models, and other utilities from the generated API client.
// This allows the rest of the application to import everything related to the API
// from this single configured entry point.
export * from "./generated-api";

// Configure the base URL for the generated API client
OpenAPI.BASE = process.env.API_URL || "http://localhost:8080";

// Define a type for API route handlers that do not require JWT authentication
type PublicApiRouteHandler<T = any> = (
  client: ApiClient,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } }
) => Promise<NextResponse<T>>;

type ApiRouteHandler<T = any> = (
  client: ApiClient,
  jwt: string,
  request: NextRequest,
  context: { params?: { [key: string]: string | string[] } }
) => Promise<NextResponse<T>>;

export function withApiClient<T = any>(handler: ApiRouteHandler<T>) {
  return async (
    request: NextRequest,
    context: { params?: { [key: string]: string | string[] } } = {}
  ): Promise<NextResponse<T | { error: string }>> => {
    const jwt = await getServerJwt();

    console.log("JWT in API route:", jwt);

    if (!jwt) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      const client = new ApiClient({
        BASE: OpenAPI.BASE,
        TOKEN: async () => jwt,
      });
      return await handler(client, jwt, request, context);
    } catch (error) {
      console.error("Unexpected error in API route:", error);
      if (error instanceof ApiError) {
        return NextResponse.json(error.body as { error: string }, {
          status: error.status,
        });
      }
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}

export function withPublicApiClient<T = any>(
  handler: PublicApiRouteHandler<T>
) {
  return async (
    request: NextRequest,
    context: { params?: { [key: string]: string | string[] } } = {}
  ): Promise<NextResponse<T | { error: string }>> => {
    try {
      const client = new ApiClient({
        BASE: OpenAPI.BASE,
      });
      return await handler(client, request, context);
    } catch (error) {
      console.error("Unexpected error in public API route:", error);
      if (error instanceof ApiError) {
        return NextResponse.json(error.body as { error: string }, {
          status: error.status,
        });
      }
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  };
}
