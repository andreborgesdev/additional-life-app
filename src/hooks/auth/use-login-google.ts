import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser-client";
import { useMutation } from "@tanstack/react-query";

export const useGoogleLogin = () => {
  const supabase = useSupabaseBrowser();

  return useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
      return data;
    },
    onError: (error) => {
      console.error("Google login error:", error);
    },
  });
};
