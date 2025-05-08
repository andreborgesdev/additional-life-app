import useSupabaseBrowser from "./supabase-browser";

export const getBrowserSession = async () => {
  const supabase = await useSupabaseBrowser();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
};
