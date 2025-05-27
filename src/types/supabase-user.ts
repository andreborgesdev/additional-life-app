export interface SupabaseUserMetadata {
  address?: string;
  avatar_url?: string;
  bio?: string;
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  name?: string;
  phone_verified?: boolean;
  preferred_language?: "ENGLISH" | "FRENCH" | "GERMAN";
  sub?: string;
  user_id?: string;
}

export interface SupabaseAppMetadata {
  provider?: string;
  providers?: string[];
}

export interface TypedSupabaseUser {
  id: string;
  aud: string;
  email?: string;
  phone?: string;
  created_at?: string;
  confirmed_at?: string;
  last_sign_in_at?: string;
  email_confirmed_at?: string;
  phone_confirmed_at?: string;
  app_metadata: SupabaseAppMetadata;
  user_metadata: SupabaseUserMetadata;
  identities?: any[];
  factors?: any[];
  role?: string;
}

export interface TypedSupabaseSession {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: TypedSupabaseUser;
}
