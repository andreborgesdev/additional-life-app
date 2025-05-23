import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRegisterOauthUser } from "../users/use-create-user";
import { useUpdateUser } from "../users/use-update-user";
import { fetchUserBySupabaseId } from "../users/use-user-by-supabase-id";
import { UserRequest } from "@/src/lib/api-client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export const useGoogleLogin = () => {
  const queryClient = useQueryClient();
  const supabase = useSupabaseBrowser();
  const router = useRouter();
  const { mutateAsync: registerOauthUser } = useRegisterOauthUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  useEffect(() => {
    if (!supabase) return;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        try {
          const { user: supabaseUser } = session;
          const {
            id: supabaseId,
            email,
            phone: phoneNumber,
            user_metadata,
          } = supabaseUser;
          const {
            full_name: fullName,
            avatar_url: avatarUrl,
            email_verified: emailVerified,
            phone_verified: phoneVerified,
          } = user_metadata || {};

          if (!email) {
            console.error("No email found in OAuth user data");
            return;
          }

          const existingUser = await fetchUserBySupabaseId(supabaseId);

          const userData: UserRequest = {
            email,
            name: fullName,
            avatarUrl,
            supabaseId,
            phoneNumber,
            emailVerified,
            phoneVerified,
          };

          if (existingUser) {
            await updateUser({
              userId: existingUser.id,
              userData,
            });
          } else {
            await registerOauthUser({
              recaptchaToken: "recaptchaToken",
              userData,
            });
          }

          queryClient.invalidateQueries({ queryKey: ["supabase-session"] });
          router.push("/");
        } catch (error) {
          console.error("Error handling OAuth user:", error);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, queryClient, registerOauthUser, updateUser, router]);

  return useMutation({
    mutationFn: async () => {
      if (!supabase) {
        throw new Error("Supabase client is not initialized.");
      }
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/users/login`,
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
