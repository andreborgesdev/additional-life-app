"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";
import { Session } from "@supabase/supabase-js";
import useSupabaseBrowser from "../lib/supabase/supabase-browser";
import { TypedSupabaseSession } from "../types/supabase-user";
import { useOAuthUserHandler } from "../hooks/auth/use-oauth-user-handler";
import { useQueryClient } from "@tanstack/react-query";

type AuthContextType = {
  session: (Session & TypedSupabaseSession) | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  session: null,
  isLoading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const supabase = useSupabaseBrowser();
  const queryClient = useQueryClient();
  const { handleOAuthUser } = useOAuthUserHandler();

  const handleOAuthUserRef = useRef(handleOAuthUser);
  const queryClientRef = useRef(queryClient);

  const [session, setSession] = useState<
    (Session & TypedSupabaseSession) | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processedOAuthUsers, setProcessedOAuthUsers] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    handleOAuthUserRef.current = handleOAuthUser;
  }, [handleOAuthUser]);

  useEffect(() => {
    queryClientRef.current = queryClient;
  }, [queryClient]);

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (!error && data.session) {
        setSession(data.session as (Session & TypedSupabaseSession) | null);

        const providers = data.session.user.app_metadata?.providers || [];
        const isOAuthLogin =
          providers.includes("google") || providers.includes("facebook");

        if (isOAuthLogin) {
          const userId = data.session.user.id;
          if (!processedOAuthUsers.has(userId)) {
            try {
              await handleOAuthUserRef.current(data.session);
              setProcessedOAuthUsers((prev) => new Set(prev).add(userId));
            } catch (error) {
              console.error(
                "Error handling OAuth user on initial load:",
                error
              );
            }
          } else {
          }
        }
      } else {
      }
      setIsLoading(false);
    };

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session as (Session & TypedSupabaseSession) | null);

      if ((event === "SIGNED_IN" || event === "TOKEN_REFRESHED") && session) {
        try {
          const providers = session.user.app_metadata?.providers || [];
          const isOAuthLogin =
            providers.includes("google") || providers.includes("facebook");

          if (isOAuthLogin) {
            const userId = session.user.id;
            if (!processedOAuthUsers.has(userId)) {
              await handleOAuthUserRef.current(session);
              setProcessedOAuthUsers((prev) => new Set(prev).add(userId));
            } else {
            }
          }
        } catch (error) {
          console.error("Error handling OAuth user:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  return (
    <AuthContext.Provider value={{ session, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useSession = () => useContext(AuthContext);
