import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFacebookLogin = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  return useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
    },
  });
};
