import { useSupabaseServer } from "./supabase-server";
import { getServerSession } from "./supabase-server-session";

export const getServerJwt = async (): Promise<string | null> => {
  const session = await getServerSession();

  if (!session) {
    throw new Error("Session not found");
  }

  return session.access_token;
};
