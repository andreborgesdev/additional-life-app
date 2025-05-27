import { useRegisterOauthUser } from "../users/use-create-oauth-user";
import { useUpdateUser } from "../users/use-update-user";
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
} from "@/src/lib/generated-api";

const fetchUserByEmail = async (
  email: string
): Promise<UserResponse | null> => {
  try {
    const encodedEmail = encodeURIComponent(email);
    const response = await fetch(`/api/users?email=${encodedEmail}`);

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error fetching user by email:", error);
    return null;
  }
};

export const useOAuthUserHandler = () => {
  const { mutateAsync: registerOauthUser } = useRegisterOauthUser();
  const { mutateAsync: updateUser } = useUpdateUser();

  const handleOAuthUser = async (session: any) => {
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
        throw new Error("No email found in OAuth user data");
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
          authProvider: session.user.app_metadata?.providers?.includes(
            "facebook"
          )
            ? CreateUserRequest.authProvider.FACEBOOK
            : CreateUserRequest.authProvider.GOOGLE,
        };

        await registerOauthUser({
          recaptchaToken: "oauth-bypass-token",
          userData,
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error handling OAuth user:", error);
      throw error;
    }
  };

  return { handleOAuthUser };
};
