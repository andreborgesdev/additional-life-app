import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useForgotPassword = () => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      // Add redirect so the recovery flow lands on the reset password page
      const redirectTo =
        typeof window !== "undefined" ? `${window.location.origin}/auth/reset-password` : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        redirectTo ? { redirectTo } : undefined,
      );
      if (error) throw error;
    },
    onSuccess: async () => {},
  });
};
