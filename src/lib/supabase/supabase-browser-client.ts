import { createBrowserClient } from "@supabase/ssr";

function getSupabaseBrowserClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

function useSupabaseBrowser() {
  return getSupabaseBrowserClient();
}

export default useSupabaseBrowser;
