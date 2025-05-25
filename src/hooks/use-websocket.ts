import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSession } from "@/src/app/auth-provider";

export interface WebSocketMessage {
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

interface UseWebSocketOptions {
  url: string;
  conversationId?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendMessage: (message: Omit<WebSocketMessage, "id" | "timestamp">) => void;
  startConversation: (
    message: Omit<WebSocketMessage, "id" | "timestamp">
  ) => void;
  disconnect: () => void;
  connect: () => void;
}

export function useWebSocket({
  url,
  conversationId,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnectAttempts = 3,
  reconnectDelay = 1000,
}: UseWebSocketOptions): UseWebSocketReturn {
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stompClient = useRef<Client | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.deactivate();
    }

    setIsConnected(false);
    setIsConnecting(false);
    reconnectCount.current = 0;
  }, []);

  const connect = useCallback(() => {
    if (!session?.access_token) {
      setError("Authentication required for WebSocket connection");
      console.log("❌ WebSocket connection failed: No access token");
      return;
    }

    if (stompClient.current && stompClient.current.connected) {
      console.log("✅ WebSocket already connected, skipping");
      return;
    }

    setIsConnecting(true);
    setError(null);
    console.log("🔄 Attempting WebSocket connection to:", url);
    console.log(
      "🔑 Using authentication token:",
      session.access_token.substring(0, 20) + "..."
    );

    try {
      stompClient.current = new Client({
        webSocketFactory: () => {
          console.log("🏭 Creating SockJS connection...");
          return new SockJS(url);
        },
        connectHeaders: {
          Authorization: `Bearer ${session.access_token}`,
        },
        debug: (str) => {
          console.log("📡 STOMP Debug:", str);
        },
        reconnectDelay: reconnectDelay,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("✅ STOMP connection established:", frame);
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
          reconnectCount.current = 0;
          onOpen?.();

          console.log("📝 Subscribing to conversation topics...");

          if (conversationId) {
            stompClient.current?.subscribe(
              `/topic/chat/${conversationId}`,
              (message: IMessage) => {
                console.log("📨 Received conversation message:", message);
                try {
                  const chatMessage: WebSocketMessage = JSON.parse(
                    message.body
                  );
                  console.log("✅ Parsed chat message:", chatMessage);
                  onMessage?.(chatMessage);
                } catch (err) {
                  console.error("❌ Failed to parse STOMP message:", err);
                }
              }
            );
          }

          stompClient.current?.subscribe(
            "/topic/public",
            (message: IMessage) => {
              console.log("📨 Received public message:", message);
              try {
                const chatMessage: WebSocketMessage = JSON.parse(message.body);
                console.log("✅ Parsed public message:", chatMessage);
                onMessage?.(chatMessage);
              } catch (err) {
                console.error("❌ Failed to parse STOMP message:", err);
              }
            }
          );
        },
        onDisconnect: (frame) => {
          console.log("❌ STOMP disconnected:", frame);
          setIsConnected(false);
          setIsConnecting(false);
          onClose?.();

          if (
            shouldReconnect.current &&
            reconnectCount.current < reconnectAttempts
          ) {
            reconnectCount.current++;
            const delay =
              reconnectDelay * Math.pow(2, reconnectCount.current - 1);
            console.log(
              `🔄 Reconnecting in ${delay}ms (attempt ${reconnectCount.current}/${reconnectAttempts})`
            );
            reconnectTimer.current = setTimeout(() => {
              connect();
            }, delay);
          }
        },
        onStompError: (frame) => {
          console.error("❌ STOMP error:", frame);
          console.error("❌ STOMP error headers:", frame.headers);
          console.error("❌ STOMP error body:", frame.body);
          setError(
            `STOMP error: ${
              frame.headers["message"] || frame.body || "Unknown error"
            }`
          );
          setIsConnecting(false);
          onError?.(new Event("stomp-error"));
        },
        onWebSocketError: (event) => {
          console.error("❌ WebSocket error:", event);
          setError("WebSocket connection error");
          setIsConnecting(false);
          onError?.(event);
        },
      });

      stompClient.current.activate();
    } catch (err) {
      console.error("❌ Failed to create STOMP connection:", err);
      setError("Failed to create STOMP connection");
      setIsConnecting(false);
    }
  }, [
    url,
    conversationId,
    session?.access_token,
    onMessage,
    onError,
    onOpen,
    onClose,
    reconnectAttempts,
    reconnectDelay,
  ]);

  const sendMessage = useCallback(
    (message: Omit<WebSocketMessage, "id" | "timestamp">) => {
      if (!stompClient.current || !stompClient.current.connected) {
        console.error("❌ Cannot send message: STOMP client not connected");
        setError("STOMP client is not connected");
        return;
      }

      const fullMessage: WebSocketMessage = {
        ...message,
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      console.log("📤 Sending message to /app/chat.sendMessage:", fullMessage);

      try {
        stompClient.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(fullMessage),
        });
        console.log("✅ Message sent successfully");
      } catch (err) {
        console.error("❌ Failed to send STOMP message:", err);
        setError("Failed to send message");
      }
    },
    []
  );

  const startConversation = useCallback(
    (message: Omit<WebSocketMessage, "id" | "timestamp">) => {
      if (!stompClient.current || !stompClient.current.connected) {
        console.error(
          "❌ Cannot start conversation: STOMP client not connected"
        );
        setError("STOMP client is not connected");
        return;
      }

      const startConversationRequest = {
        itemId: message.itemId,
        senderId: message.senderId,
        recipientId: message.recipientId,
        content: message.content,
      };

      console.log(
        "📤 Starting conversation via /app/chat.startConversation:",
        startConversationRequest
      );

      try {
        stompClient.current.publish({
          destination: "/app/chat.startConversation",
          body: JSON.stringify(startConversationRequest),
        });
        console.log("✅ Conversation started successfully");
      } catch (err) {
        console.error("❌ Failed to start conversation:", err);
        setError("Failed to start conversation");
      }
    },
    []
  );

  useEffect(() => {
    return () => {
      shouldReconnect.current = false;
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    shouldReconnect.current = true;

    if (session?.access_token) {
      connect();
    } else {
      disconnect();
    }
  }, [session?.access_token, connect, disconnect]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    startConversation,
    disconnect,
    connect,
  };
}
