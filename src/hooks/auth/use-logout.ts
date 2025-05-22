"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabaseBrowser from "../../lib/supabase/supabase-browser";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: async () => {
      // Clear cached session
      await queryClient.invalidateQueries({ queryKey: ["supabase-session"] });

      // Optional: refresh router to re-trigger SSR auth check or redirect
      router.refresh();

      // Optionally redirect to login page
      router.push("/users/login");
    },
  });
};
