import { useQuery } from "@tanstack/react-query";
import { useSession } from "@/src/app/auth-provider";
import { ChatListItem } from "@/src/types/chat";
import { createChatApiService } from "@/src/services/chat-api.service";
import { useMemo } from "react";

export const extractItemIdFromChatId = (chatId: string): string => {
  return chatId.split("-")[0] || "";
};

export const useUserChats = () => {
  const { session } = useSession();

  const chatApiService = useMemo(
    () => createChatApiService(() => session?.access_token || null),
    [session?.access_token]
  );

  return useQuery<ChatListItem[], Error>({
    queryKey: ["user-chats", session?.user?.id],
    queryFn: () => {
      if (!session?.user?.user_metadata?.user_id) {
        throw new Error("User ID required");
      }
      return chatApiService.getUserChats(session.user.user_metadata.user_id);
    },
    enabled: Boolean(session?.access_token && session?.user?.id),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: false,
  });
};
