import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

function getSupabaseBrowserClient() {
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function useSupabaseBrowser(): any {
  return useMemo(getSupabaseBrowserClient, []);
}

export default useSupabaseBrowser;
