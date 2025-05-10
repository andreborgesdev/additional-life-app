import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";

export async function useSupabaseServer() {
  const cookieStore = await cookies();
  const headerStore = headers();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        // getAll() {
        //   return cookieStore.getAll();
        // },
        // setAll(cookiesToSet) {
        //   try {
        //     cookiesToSet.forEach(({ name, value, options }) =>
        //       cookieStore.set(name, value, options)
        //     );
        //   } catch {
        //     // The `setAll` method was called from a Server Component.
        //     // This can be ignored if you have middleware refreshing
        //     // user sessions.
        //   }
        // },
        get(name) {
          return cookieStore.get(name)?.value;
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // ignore in server components
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, "", { ...options, maxAge: -1 });
          } catch {
            // ignore in server components
          }
        },
      },
      headers: Object.fromEntries(headerStore.entries()),
    }
  );
}
