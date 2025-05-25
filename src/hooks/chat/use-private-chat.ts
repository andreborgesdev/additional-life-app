import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useSession } from "@/src/app/auth-provider";
import { useWebSocket, WebSocketMessage } from "../use-websocket";

export interface ChatMessage {
  id: string;
  conversationId?: string;
  itemId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  timestamp: string;
}

interface UsePrivateChatOptions {
  itemId: string;
  otherUserId: string;
  websocketUrl?: string;
}

interface UsePrivateChatReturn {
  messages: ChatMessage[];
  isLoading: boolean;
  isConnected: boolean;
  error: string | null;
  conversationId: string | null;
  sendMessage: (content: string, isFirstMessage?: boolean) => void;
  loadChatHistory: () => Promise<void>;
  markAsRead: () => void;
}

const CHAT_QUERY_KEY = "chat";
const STALE_TIME = 30 * 1000;

const fetchChatHistory = async (
  itemId: string,
  otherUserId: string
): Promise<ChatMessage[]> => {
  const response = await fetch(
    `/api/v1/chat/history?itemId=${itemId}&otherUserId=${otherUserId}`
  );

  if (!response.ok) {
    throw new Error(`Failed to load chat history: ${response.statusText}`);
  }

  return response.json();
};

const getOrCreateConversation = async (
  itemId: string,
  currentUserId: string,
  otherUserId: string
): Promise<string> => {
  const response = await fetch(
    `/api/v1/chat/conversation?itemId=${itemId}&currentUser=${currentUserId}&otherUser=${otherUserId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get conversation: ${response.statusText}`);
  }

  const data = await response.json();
  return data.conversationId;
};

const markChatAsRead = async (
  itemId: string,
  otherUserId: string
): Promise<void> => {
  const response = await fetch("/api/v1/chat/mark-read", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ itemId, otherUserId }),
  });

  if (!response.ok) {
    throw new Error("Failed to mark messages as read");
  }
};

export function usePrivateChat({
  itemId,
  otherUserId,
  websocketUrl = process.env.NEXT_PUBLIC_WEBSOCKET_URL,
}: UsePrivateChatOptions): UsePrivateChatReturn {
  const { session } = useSession();
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    data: historyMessages = [],
    isLoading,
    refetch: loadChatHistory,
    error: historyError,
  } = useQuery({
    queryKey: [CHAT_QUERY_KEY, "history", itemId, otherUserId],
    queryFn: () => fetchChatHistory(itemId, otherUserId),
    enabled: Boolean(session?.access_token && itemId && otherUserId),
    staleTime: STALE_TIME,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const fetchConversationId = async () => {
      if (session?.user?.id && itemId && otherUserId) {
        try {
          const convId = await getOrCreateConversation(
            itemId,
            session.user.id,
            otherUserId
          );
          setConversationId(convId);
        } catch (err) {
          console.error("Failed to get conversation ID:", err);
          setError("Failed to get conversation");
        }
      }
    };

    fetchConversationId();
  }, [session?.user?.id, itemId, otherUserId]);

  const markAsReadMutation = useMutation({
    mutationFn: () => markChatAsRead(itemId, otherUserId),
    onError: (err) => {
      console.error("Failed to mark messages as read:", err);
    },
  });

  const handleWebSocketMessage = useCallback((wsMessage: WebSocketMessage) => {
    const chatMessage: ChatMessage = {
      id: wsMessage.id,
      conversationId: wsMessage.conversationId,
      itemId: wsMessage.itemId,
      senderId: wsMessage.senderId,
      senderName: wsMessage.senderName,
      recipientId: wsMessage.recipientId,
      content: wsMessage.content,
      type: wsMessage.type,
      timestamp: wsMessage.timestamp,
    };

    setRealtimeMessages((prev) => {
      const exists = prev.some((msg) => msg.id === chatMessage.id);
      if (exists) return prev;
      return [...prev, chatMessage];
    });
  }, []);

  const {
    isConnected,
    sendMessage: sendWebSocketMessage,
    startConversation,
  } = useWebSocket({
    url: websocketUrl || "",
    conversationId: conversationId || undefined,
    onMessage: handleWebSocketMessage,
    onError: () => {
      setError("Connection error");
    },
  });

  const sendMessage = useCallback(
    (content: string, isFirstMessage = false) => {
      if (!session?.user?.id || !isConnected) {
        setError("Cannot send message: not connected");
        return;
      }

      const messageData = {
        conversationId: conversationId || undefined,
        itemId,
        senderId: session.user.id,
        senderName:
          session.user.user_metadata?.full_name ||
          session.user.email ||
          "Unknown User",
        recipientId: otherUserId,
        content,
        type: "CHAT" as const,
      };

      if (isFirstMessage || !conversationId) {
        startConversation(messageData);
      } else {
        sendWebSocketMessage(messageData);
      }
    },
    [
      session?.user?.id,
      session?.user?.user_metadata?.full_name,
      session?.user?.email,
      isConnected,
      conversationId,
      sendWebSocketMessage,
      startConversation,
      itemId,
      otherUserId,
    ]
  );

  const markAsRead = useCallback(() => {
    if (!session?.access_token || !itemId || !otherUserId) return;
    markAsReadMutation.mutate();
  }, [session?.access_token, itemId, otherUserId, markAsReadMutation]);

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
    if (historyError) {
      setError(
        historyError instanceof Error
          ? historyError.message
          : "Failed to load chat history"
      );
    } else {
      setError(null);
    }
  }, [historyError]);

  useEffect(() => {
    setRealtimeMessages([]);
  }, [itemId, otherUserId]);

  return {
    messages: allMessages,
    isLoading,
    isConnected,
    error,
    conversationId,
    sendMessage,
    loadChatHistory: () => loadChatHistory().then(() => {}),
    markAsRead,
  };
}
