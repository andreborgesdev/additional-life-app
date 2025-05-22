import { useMutation } from "@tanstack/react-query";
import useSupabaseBrowser from "../../lib/supabase/supabase-browser";

interface UpdatePasswordArgs {
  newPassword: string;
}

export const useUpdatePassword = () => {
  const supabase = useSupabaseBrowser();

  return useMutation<void, Error, UpdatePasswordArgs>({
    mutationFn: async ({ newPassword }) => {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) {
        throw new Error(error.message || "Failed to update password.");
      }
    },
  });
};
