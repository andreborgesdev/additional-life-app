import { OpenAPI } from "./generated-api/core/OpenAPI";
import { getBrowserSession } from "./supabase/supabase-browser-session";
import { getServerJwt } from "./supabase/supabase-server-jwt";

// Re-export all services, models, and other utilities from the generated API client.
// This allows the rest of the application to import everything related to the API
// from this single configured entry point.
export * from "./generated-api";

// Configure the base URL for the generated API client
OpenAPI.BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
