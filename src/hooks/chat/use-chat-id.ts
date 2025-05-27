import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/src/app/auth-provider";
import { createChatApiService } from "@/src/services/chat-api.service";
import { useMemo } from "react";

const CHAT_ID_QUERY_KEY = "chat-id";
const STALE_TIME = 5 * 60 * 1000;

interface UseChatIdOptions {
  itemId: string;
  userId: string;
  enabled?: boolean;
}

interface UseChatIdReturn {
  chatId: string | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useChatId({
  itemId,
  userId,
  enabled = true,
}: UseChatIdOptions): UseChatIdReturn {
  const { session } = useSession();

  const chatApiService = useMemo(
    () => createChatApiService(() => session?.access_token || null),
    [session?.access_token]
  );

  const {
    data: chatId,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [CHAT_ID_QUERY_KEY, itemId, userId],
    queryFn: () => chatApiService.getChatId(itemId, userId),
    enabled: Boolean(session?.access_token && itemId && userId && enabled),
    staleTime: STALE_TIME,
    retry: 2,
    refetchOnWindowFocus: false,
  });

  return {
    chatId,
    isLoading,
    error,
    refetch: () => refetch().then(() => {}),
  };
}
