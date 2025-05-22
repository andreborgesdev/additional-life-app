import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateUser } from "../users/use-create-user";
import { useUpdateUser } from "../users/use-update-user";
import { getUserQueryOptions } from "../users/use-user-by-supabase-id";
import { UserRequest } from "@/src/lib/api-client";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  return useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["supabase-session"] });

      if (!supabase) {
        return;
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          if (subscription) {
            subscription.unsubscribe();
          }

          try {
            const supabaseUser = session.user;
            const supabaseId = supabaseUser.id;
            const email = supabaseUser.email;
            const phoneNumber = supabaseUser.phone;
            const fullName = supabaseUser.user_metadata?.full_name;
            const avatarUrl = supabaseUser.user_metadata?.avatar_url;
            const emailVerified = supabaseUser.user_metadata?.email_verified;
            const phoneVerified = supabaseUser.user_metadata?.phone_verified;

            if (!email) {
              return;
            }

            const existingUser = await queryClient.fetchQuery(
              getUserQueryOptions(supabaseId)
            );

            const userCreateData: UserRequest = {
              email,
              name: fullName,
              avatarUrl: avatarUrl,
              supabaseId,
              phoneNumber: phoneNumber,
              emailVerified: emailVerified,
              phoneVerified: phoneVerified,
            };

            if (existingUser) {
              const userUpdateData: Partial<UserRequest> = {
                email,
                name: fullName,
                avatarUrl: avatarUrl,
                phoneNumber: phoneNumber,
                emailVerified: emailVerified,
                phoneVerified: phoneVerified,
              };
              await updateUser({
                userId: existingUser.id,
                userData: userUpdateData as UserRequest,
              });
            } else {
              await createUser(userCreateData);
            }
          } catch (error) {}
        } else if (event === "SIGNED_OUT") {
          if (subscription) {
            subscription.unsubscribe();
          }
        }
      });
    },
    onError: (error) => {},
  });
};
