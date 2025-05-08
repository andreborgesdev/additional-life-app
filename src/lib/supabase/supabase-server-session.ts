import { useSupabaseServer } from "./supabase-server";

export const getServerSession = async () => {
  const supabase = await useSupabaseServer();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
