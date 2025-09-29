import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser-client";
import { useMutation } from "@tanstack/react-query";

export const useFacebookLogin = () => {
  const supabase = useSupabaseBrowser();

  return useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    },
    onError: (error) => {
      console.error("Facebook login error:", error);
    },
  });
};
