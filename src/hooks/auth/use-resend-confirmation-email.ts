"use client";

import { useMutation } from "@tanstack/react-query";
import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser-client";

/**
 * Hook to resend the email confirmation (signup) email for a given address.
 * Uses Supabase auth.resend with type 'signup'.
 */
export const useResendConfirmationEmail = () => {
  const supabase = useSupabaseBrowser();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!email) throw new Error("Email is required");
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/callback` : undefined;
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: redirectTo ? { emailRedirectTo: redirectTo } : undefined,
      });
      if (error) throw error;
    },
  });
};

export default useResendConfirmationEmail;
