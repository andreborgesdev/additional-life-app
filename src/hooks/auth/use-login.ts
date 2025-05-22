"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabaseBrowser from "../../lib/supabase/supabase-browser";

export const useLogin = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();

  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
    },
  });
};
