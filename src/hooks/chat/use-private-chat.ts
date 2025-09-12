import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "@/src/app/auth-provider";
import { useWebSocket } from "../use-websocket";
import { getUserDisplayName } from "@/src/utils/user-metadata-utils";
import { useChatId } from "./use-chat-id";
import { ChatMessage, WebSocketMessage } from "@/src/types/chat";
import { createChatApiService } from "@/src/services/chat-api.service";

interface UsePrivateChatOptions {
  itemId: string;
  ownUserId: string;
  otherUserId: string;
  chatId?: string;
  websocketUrl?: string;
}

interface UsePrivateChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  chatId: string | undefined;
  peerOnline: boolean;
  sendMessage: (content: string, isFirstMessage?: boolean) => string | null;
  loadChatHistory: () => Promise<void>;
  markAsRead: () => void;
}

const CHAT_QUERY_KEY = "chat";
const STALE_TIME = 30 * 1000;

export function usePrivateChat({
  itemId,
  ownUserId,
  otherUserId,
  chatId: providedChatId,
  websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL,
}: UsePrivateChatOptions): UsePrivateChatReturn {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [peerOnline, setPeerOnline] = useState<boolean>(false);
  const currentChatRef = useRef<string>("");

  const chatApiService = useMemo(
    () => createChatApiService(() => session?.access_token || null),
    [session?.access_token]
  );

  const {
    chatId: derivedChatId,
    isLoading: isChatIdLoading,
    error: chatIdError,
  } = useChatId({
    itemId,
    userId: ownUserId,
    enabled: Boolean(
      !providedChatId && session?.user?.id && itemId && ownUserId
    ),
  });

  const chatId = providedChatId || derivedChatId;

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    refetch: loadChatHistory,
    error: historyError,
  } = useQuery({
    queryKey: [CHAT_QUERY_KEY, "history", chatId],
    queryFn: () => {
      if (!chatId) {
        throw new Error("Chat ID required");
      }
      return chatApiService.getChatHistory(chatId);
    },
    enabled: Boolean(session?.access_token && chatId),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  const historyMessages = historyData?.messages || [];

  useEffect(() => {
    if (historyData?.peerOnline !== undefined) {
      setPeerOnline(historyData.peerOnline);
    }
  }, [historyData?.peerOnline]);

  const isLoading = isChatIdLoading || isHistoryLoading;

  useEffect(() => {
    if (historyError) {
      setError(
        historyError instanceof Error
          ? historyError.message
          : "Failed to load chat history"
      );
    } else if (chatIdError) {
      setError(
        chatIdError instanceof Error
          ? chatIdError.message
          : "Failed to get chat ID"
      );
    } else {
      setError(null);
    }
  }, [historyError, chatIdError]);

  const markAsReadMutation = useMutation({
    mutationFn: () => {
      if (!chatId || !session?.user?.id) {
        throw new Error("Missing required parameters for marking as read");
      }
      return chatApiService.markChatAsRead(chatId, session.user.id);
    },
    onError: (err) => {
      console.error("Failed to mark messages as read:", err);
    },
  });

  const handleWebSocketMessage = useCallback(
    (wsMessage: WebSocketMessage) => {
      const isRelevantByParticipants =
        wsMessage.itemId === itemId &&
        ((wsMessage.senderId === ownUserId &&
          wsMessage.recipientId === otherUserId) ||
          (wsMessage.senderId === otherUserId &&
            wsMessage.recipientId === ownUserId));

      if (!isRelevantByParticipants) {
        return;
      }

      if (wsMessage.chatId && chatId && wsMessage.chatId !== chatId) {
        return;
      }

      const chatMessage: ChatMessage = {
        id: wsMessage.id || `${wsMessage.senderId}-${wsMessage.timestamp}`,
        chatId: wsMessage.chatId || chatId || "",
        itemId: wsMessage.itemId,
        senderId: wsMessage.senderId,
        recipientId: wsMessage.recipientId,
        content: wsMessage.content,
        type: wsMessage.type as ChatMessage["type"],
        timestamp: wsMessage.timestamp,
      };

      setRealtimeMessages((prev) => {
        const exists = prev.some((msg) => msg.id === chatMessage.id);
        if (exists) {
          return prev;
        }

        const newState = [...prev, chatMessage];

        if (prev.length === 0) {
          queryClient.invalidateQueries({
            queryKey: ["user-chats", session?.user?.id],
          });
        }

        return newState;
      });
    },
    [itemId, ownUserId, otherUserId, chatId, queryClient, session?.user?.id]
  );

  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    startChat,
  } = useWebSocket({
    url: websocketUrl || "",
    userId: ownUserId,
    onMessage: handleWebSocketMessage,
    onError: () => {
      setError("Connection error");
    },
  });

  const sendMessage = useCallback(
    (content: string, isFirstMessage = false): string | null => {
      if (!session?.user?.id || !isConnected) {
        setError("Cannot send message: not connected");
        return null;
      }

      // Generate message ID
      const messageId = crypto.randomUUID();

      const messageData = {
        chatId: chatId,
        itemId,
        senderId: session.user.user_metadata.user_id || "",
        senderName: getUserDisplayName(session),
        recipientId: otherUserId,
        content,
        type: "CHAT" as const,
      };

      // Send the message via WebSocket - rely entirely on server response
      const messageToSend = {
        ...messageData,
        id: messageId,
      };

      try {
        if (isFirstMessage || !chatId) {
          startChat(messageToSend);
          queryClient.invalidateQueries({
            queryKey: ["user-chats", session?.user?.id],
          });
          queryClient.invalidateQueries({
            queryKey: ["chat-id", itemId, otherUserId],
          });
        } else {
          sendWebSocketMessage(messageToSend);
        }
        return messageId;
      } catch (error) {
        console.error("Failed to send message:", error);
        setError("Failed to send message");
        return null;
      }
    },
    [
      session?.user?.id,
      isConnected,
      chatId,
      sendWebSocketMessage,
      startChat,
      itemId,
      otherUserId,
      queryClient,
    ]
  );

  const markAsRead = useCallback(() => {
    if (!chatId || !session?.user?.id) return;
    markAsReadMutation.mutate();
  }, [chatId, session?.user?.id, markAsReadMutation]);

  const allMessages = useMemo(() => {
    const combined = [...historyMessages, ...realtimeMessages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    return combined.filter(
      (message, index, arr) =>
        arr.findIndex((m) => m.id === message.id) === index
    );
  }, [historyMessages, realtimeMessages]);

  useEffect(() => {
    const currentChatKey = `${itemId}-${otherUserId}`;

    if (currentChatRef.current !== currentChatKey) {
      setRealtimeMessages([]);
      currentChatRef.current = currentChatKey;
    }
  }, [itemId, otherUserId]);

  return {
    messages: allMessages,
    isLoading,
    isConnected,
    error,
    chatId,
    peerOnline,
    sendMessage,
    loadChatHistory: () => loadChatHistory().then(() => {}),
    markAsRead,
  };
}
