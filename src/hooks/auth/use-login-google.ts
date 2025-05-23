import useSupabaseBrowser from "@/src/lib/supabase/supabase-browser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRegisterOauthUser } from "../users/use-create-user";
import { useUpdateUser } from "../users/use-update-user";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreateUserRequest, UpdateUserRequest } from "@/src/lib/generated-api";
import { fetchUserByEmail } from "../users/use-user-by-email";

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
            email_verified: isEmailVerified,
            phone_verified: isPhoneVerified,
          } = user_metadata || {};

          if (!email) {
            console.error("No email found in OAuth user data");
            return;
          }

          const existingUser = await fetchUserByEmail(email);

          if (existingUser) {
            const userData: UpdateUserRequest = {
              email: email,
              name: fullName,
              avatarUrl: avatarUrl || existingUser.avatarUrl,
              isEmailVerified: isEmailVerified || existingUser.isEmailVerified,
              isPhoneVerified: isPhoneVerified || existingUser.isPhoneVerified,
            };

            await updateUser({
              userId: existingUser.id,
              userData,
            });
          } else {
            const userData: CreateUserRequest = {
              supabaseId: supabaseId,
              email: email,
              name: fullName,
              avatarUrl: avatarUrl,
              isEmailVerified: isEmailVerified,
              isPhoneVerified: isPhoneVerified,
              authProvider: CreateUserRequest.authProvider.GOOGLE,
            };

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
          redirectTo: `${window.location.origin}/auth/login`,
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
