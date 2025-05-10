"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import useSupabaseBrowser from "../lib/supabase/supabase-browser";

type AuthContextType = {
  session: Session | null;
};

const AuthContext = createContext<AuthContextType>({ session: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useSupabaseBrowser();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session }}>{children}</AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
