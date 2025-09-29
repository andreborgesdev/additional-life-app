// filepath: /Users/sudre/Projects/additional-life-app/src/hooks/auth/use-redirect-if-authenticated.ts
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser-client";

interface Options {
  /** Allow staying on page when coming from a recovery link (hash contains type=recovery) */
  allowRecovery?: boolean;
  /** Optional custom redirect path (defaults to "/") */
  redirectTo?: string;
}

/**
 * Shared hook to prevent authenticated users from accessing auth pages.
 * Returns a boolean `checking` to let the page defer rendering until the session state is known.
 */
export function useRedirectIfAuthenticated(options: Options = {}) {
  const { allowRecovery = false, redirectTo = "/" } = options;
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const supabase = useSupabaseBrowser();

  useEffect(() => {
    let isMounted = true;
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    const isRecovery = allowRecovery && hash.includes("type=recovery");

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) return;
      if (data.session && !isRecovery) {
        router.replace(redirectTo);
      } else {
        setChecking(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session && !(allowRecovery && window.location.hash.includes("type=recovery"))) {
        router.replace(redirectTo);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allowRecovery, redirectTo]);

  return { checking };
}
