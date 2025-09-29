import { useSupabaseServerClient } from "../supabase-server-client";

export async function getUser() {
  const supabase = await useSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getUserFullNameByUUID(userId: string): Promise<string | null> {
  const supabase = await useSupabaseServerClient();

  const { data, error } = await supabase.auth.admin.getUserById(userId);
  if (error || !data?.user) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data.user.user_metadata?.full_name || data.user.user_metadata?.name || null;
}
