import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [peerOnline, setPeerOnline] = useState<boolean>(false);
  const currentChatRef = useRef<string>("");

  // Debug logging for realtime messages changes
  useEffect(() => {
    console.log("📱 Realtime messages updated:", {
      count: realtimeMessages.length,
      messages: realtimeMessages.map((m) => ({
        id: m.id,
        content: m.content.substring(0, 30),
      })),
    });
  }, [realtimeMessages]);

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
      console.log("🔍 Evaluating incoming WebSocket message:", {
        messageId: wsMessage.id,
        messageItemId: wsMessage.itemId,
        currentItemId: itemId,
        messageChatId: wsMessage.chatId,
        currentChatId: chatId,
        messageSender: wsMessage.senderId,
        messageRecipient: wsMessage.recipientId,
        ownUserId,
        otherUserId,
        content: wsMessage.content.substring(0, 30),
      });

      // Check if this message belongs to the current conversation
      const isRelevantByParticipants =
        wsMessage.itemId === itemId &&
        ((wsMessage.senderId === ownUserId &&
          wsMessage.recipientId === otherUserId) ||
          (wsMessage.senderId === otherUserId &&
            wsMessage.recipientId === ownUserId));

      if (!isRelevantByParticipants) {
        console.log(
          "🚫 Message not relevant to current conversation participants"
        );
        return;
      }

      // For messages with chatId, check if it matches our current chat (but be lenient for new chats)
      if (wsMessage.chatId && chatId && wsMessage.chatId !== chatId) {
        console.log("🚫 Message chatId doesn't match current chatId");
        return;
      }

      console.log("✅ Processing relevant WebSocket message:", {
        originalId: wsMessage.id,
        generatedId:
          wsMessage.id || `${wsMessage.senderId}-${wsMessage.timestamp}`,
        content: wsMessage.content.substring(0, 30),
        timestamp: wsMessage.timestamp,
      });

      const chatMessage: ChatMessage = {
        id: wsMessage.id || `${wsMessage.senderId}-${wsMessage.timestamp}`, // Fallback ID if server doesn't provide one
        chatId: wsMessage.chatId || chatId || "",
        itemId: wsMessage.itemId,
        senderId: wsMessage.senderId,
        recipientId: wsMessage.recipientId,
        content: wsMessage.content,
        type: wsMessage.type as ChatMessage["type"],
        timestamp: wsMessage.timestamp,
      };

      console.log("🔧 About to update realtimeMessages, current state:", {
        currentCount: undefined, // We'll see this in the state update
        newMessage: {
          id: chatMessage.id,
          content: chatMessage.content.substring(0, 30),
        },
      });

      setRealtimeMessages((prev) => {
        console.log("🔧 Inside setRealtimeMessages callback:", {
          prevCount: prev.length,
          prevMessages: prev.map((m) => ({
            id: m.id,
            content: m.content.substring(0, 30),
          })),
          newMessageId: chatMessage.id,
        });

        // Simple deduplication - if message ID exists, skip it
        const exists = prev.some((msg) => msg.id === chatMessage.id);
        if (exists) {
          console.log(
            "🔄 Message ID already exists, skipping:",
            chatMessage.id
          );
          return prev;
        }

        // Add new message
        console.log("📝 Adding new WebSocket message:", chatMessage);
        const newState = [...prev, chatMessage];
        console.log("📝 New state will have:", {
          count: newState.length,
          messages: newState.map((m) => ({
            id: m.id,
            content: m.content.substring(0, 30),
          })),
        });
        return newState;
      });
    },
    [itemId, ownUserId, otherUserId, chatId]
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
        } else {
          sendWebSocketMessage(messageToSend);
        }
        console.log("✅ Message sent via WebSocket:", messageId);
        return messageId;
      } catch (error) {
        console.error("❌ Failed to send message:", error);
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
    ]
  );

  const markAsRead = useCallback(() => {
    if (!chatId || !session?.user?.id) return;
    markAsReadMutation.mutate();
  }, [chatId, session?.user?.id, markAsReadMutation]);

  const allMessages = useMemo(() => {
    console.log("🔄 Recomputing allMessages:", {
      historyCount: historyMessages.length,
      realtimeCount: realtimeMessages.length,
      chatId,
    });

    const combined = [...historyMessages, ...realtimeMessages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );

    const deduplicated = combined.filter(
      (message, index, arr) =>
        arr.findIndex((m) => m.id === message.id) === index
    );

    console.log("📊 Final message counts:", {
      combined: combined.length,
      deduplicated: deduplicated.length,
      finalMessages: deduplicated.map((m) => ({
        id: m.id,
        content: m.content.substring(0, 30),
      })),
    });

    return deduplicated;
  }, [historyMessages, realtimeMessages, chatId]);

  useEffect(() => {
    const currentChatKey = `${itemId}-${otherUserId}`;
    console.log("🔑 Chat key check:", {
      newKey: currentChatKey,
      oldKey: currentChatRef.current,
      shouldReset: currentChatRef.current !== currentChatKey,
    });

    if (currentChatRef.current !== currentChatKey) {
      console.log("🧹 Clearing realtime messages for new chat");
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
