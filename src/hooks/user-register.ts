"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import useSupabaseBrowser from "../lib/supabase/supabase-browser";

export const useRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      email,
      password,
      name,
    }: {
      email: string;
      password: string;
      name: string;
    }) => {
      const supabase = useSupabaseBrowser();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name, // You can choose the key name for user_metadata
          },
        },
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
    },
  });
};
