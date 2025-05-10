import { cookies } from "next/headers";
import { useSupabaseServer } from "./supabase-server";

export async function getUser() {
  const supabase = await useSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
