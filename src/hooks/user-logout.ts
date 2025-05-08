"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabaseBrowserClient } from "../lib/createBrowserClient";

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const supabase = supabaseBrowserClient;
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
    },
  });
};
