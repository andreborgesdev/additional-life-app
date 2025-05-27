import { useSession } from "../app/auth-provider";
import { TypedSupabaseSession } from "../types/supabase-user";

/**
 * Type-safe utility functions for accessing Supabase user metadata
 */

export const getUserDisplayName = (
  session: TypedSupabaseSession | null
): string => {
  if (!session?.user) return "Anonymous";

  const { user_metadata } = session.user;
  return (
    user_metadata?.full_name ||
    user_metadata?.name ||
    session.user.email ||
    "Unknown User"
  );
};

export const getUserAvatarUrl = (
  session: TypedSupabaseSession | null
): string | undefined => {
  return session?.user?.user_metadata?.avatar_url;
};

export const getUserPreferredLanguage = (
  session: TypedSupabaseSession | null
): "ENGLISH" | "FRENCH" | "GERMAN" => {
  return session?.user?.user_metadata?.preferred_language || "ENGLISH";
};

export const isEmailVerified = (
  session: TypedSupabaseSession | null
): boolean => {
  return session?.user?.user_metadata?.email_verified || false;
};

export const isPhoneVerified = (
  session: TypedSupabaseSession | null
): boolean => {
  return session?.user?.user_metadata?.phone_verified || false;
};

export const getUserAddress = (
  session: TypedSupabaseSession | null
): string | undefined => {
  return session?.user?.user_metadata?.address;
};

export const getUserBio = (
  session: TypedSupabaseSession | null
): string | undefined => {
  return session?.user?.user_metadata?.bio;
};

export const getUserInitials = (
  session: TypedSupabaseSession | null
): string => {
  const displayName = getUserDisplayName(session);
  return displayName.charAt(0).toUpperCase();
};

export const getUserId = (
  session: TypedSupabaseSession | null
): string | undefined => {
  return session?.user?.user_metadata?.user_id;
};

export const getUserSub = (
  session: TypedSupabaseSession | null
): string | undefined => {
  return session?.user?.user_metadata?.sub;
};

/**
 * Custom hook for type-safe user metadata access
 */
export const useTypedUserMetadata = () => {
  const { session, isLoading } = useSession();

  return {
    session: session as TypedSupabaseSession | null,
    isLoading,
    displayName: getUserDisplayName(session),
    avatarUrl: getUserAvatarUrl(session),
    preferredLanguage: getUserPreferredLanguage(session),
    isEmailVerified: isEmailVerified(session),
    isPhoneVerified: isPhoneVerified(session),
    address: getUserAddress(session),
    bio: getUserBio(session),
    initials: getUserInitials(session),
    userId: getUserId(session),
    sub: getUserSub(session),
  };
};
