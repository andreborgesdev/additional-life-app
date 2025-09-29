import { createServerClient } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

interface SessionOptions {
  req: NextRequest;
  res: NextResponse;
}

export const getServerSession = async (options?: SessionOptions) => {
  let supabase: ReturnType<typeof createServerClient>;

  if (options) {
    const { req, res } = options;
    supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll();
          },
          setAll(cookies) {
            cookies.forEach(({ name, value, options }) => res.cookies.set(name, value, options));
          },
        },
      },
    );
  } else {
    // Dynamically import to avoid bundling next/headers into middleware
    const { useSupabaseServerClient } = await import("./supabase-server-client");
    supabase = await useSupabaseServerClient();
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
