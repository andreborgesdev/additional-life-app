import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSession } from "@/src/app/auth-provider";

export interface WebSocketMessage {
  id: string;
  chatId?: string;
  itemId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  timestamp: string;
}

export interface NotificationEvent {
  id: string;
  type: "MESSAGE" | "ITEM_STATUS_CHANGED" | "CHAT_STARTED" | "SYSTEM";
  title: string;
  message: string;
  userId: string;
  timestamp: string;
  read: boolean;
  metadata?: {
    itemId?: string;
    chatId?: string;
    fromUserId?: string;
    fromUserName?: string;
    link?: string;
    [key: string]: any;
  };
}

interface UseWebSocketOptions {
  url: string;
  userId?: string;
  onMessage?: (message: WebSocketMessage) => void;
  onNotification?: (notification: NotificationEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  enableNotifications?: boolean;
}

interface UseWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  sendMessage: (
    message: Omit<WebSocketMessage, "timestamp"> & { id?: string }
  ) => void;
  startChat: (
    message: Omit<WebSocketMessage, "timestamp"> & { id?: string }
  ) => void;
  disconnect: () => void;
  connect: () => void;
}

export function useWebSocket({
  url,
  userId,
  onMessage,
  onNotification,
  onError,
  onOpen,
  onClose,
  reconnectAttempts = 3,
  reconnectDelay = 1000,
  enableNotifications = true,
}: UseWebSocketOptions): UseWebSocketReturn {
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stompClient = useRef<Client | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);
  const currentSubscription = useRef<any>(null);
  const notificationSubscription = useRef<any>(null);

  const stableOnMessage = useCallback(
    (message: WebSocketMessage) => {
      onMessage?.(message);
    },
    [onMessage]
  );

  const stableOnNotification = useCallback(
    (notification: NotificationEvent) => {
      onNotification?.(notification);
    },
    [onNotification]
  );

  const stableOnError = useCallback(
    (event: Event) => {
      onError?.(event);
    },
    [onError]
  );

  const stableOnOpen = useCallback(() => {
    onOpen?.();
  }, [onOpen]);

  const stableOnClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const disconnect = useCallback(() => {
    shouldReconnect.current = false;

    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current);
      reconnectTimer.current = null;
    }

    if (currentSubscription.current) {
      console.log("🧹 Cleaning up chat subscription");
      currentSubscription.current.unsubscribe();
      currentSubscription.current = null;
    }

    if (notificationSubscription.current) {
      console.log("🧹 Cleaning up notification subscription");
      notificationSubscription.current.unsubscribe();
      notificationSubscription.current = null;
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

    if (!url) {
      setError("WebSocket URL is required");
      console.log("❌ WebSocket connection failed: No URL provided");
      return;
    }

    if (stompClient.current?.active) {
      console.log("✅ WebSocket already active, skipping");
      return;
    }

    if (isConnecting) {
      console.log("⏳ Connection already in progress, skipping");
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
      if (stompClient.current) {
        stompClient.current.deactivate();
      }

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
        reconnectDelay: 0,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("✅ STOMP connection established:", frame);
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
          reconnectCount.current = 0;
          stableOnOpen();
        },
        onDisconnect: (frame) => {
          console.log("❌ STOMP disconnected:", frame);
          setIsConnected(false);
          setIsConnecting(false);
          stableOnClose();

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
              if (shouldReconnect.current) {
                connect();
              }
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
          stableOnError(new Event("stomp-error"));
        },
        onWebSocketError: (event) => {
          console.error("❌ WebSocket error:", event);
          setError("WebSocket connection error");
          setIsConnecting(false);
          stableOnError(event);
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
    session?.access_token,
    stableOnOpen,
    stableOnError,
    stableOnClose,
    reconnectAttempts,
    reconnectDelay,
    isConnecting,
  ]);

  const subscribeToChat = useCallback(() => {
    if (!userId || !stompClient.current?.connected) {
      console.log("⏳ Cannot subscribe: no userId or client not connected");
      return;
    }

    if (currentSubscription.current) {
      console.log("🧹 Unsubscribing from previous chat subscription");
      currentSubscription.current.unsubscribe();
      currentSubscription.current = null;
    }

    try {
      console.log(`📝 Subscribing to chat topic: /user/${userId}/msg`);
      const subscription = stompClient.current.subscribe(
        `/user/${userId}/msg`,
        (message: IMessage) => {
          console.log("📨 Received chat message:", message);
          try {
            const chatMessage: WebSocketMessage = JSON.parse(message.body);
            console.log("✅ Parsed chat message:", chatMessage);
            stableOnMessage(chatMessage);
          } catch (err) {
            console.error("❌ Failed to parse STOMP message:", err);
          }
        }
      );
      currentSubscription.current = subscription;
      console.log("✅ Successfully subscribed to chat topics");
      return subscription;
    } catch (err) {
      console.error("❌ Failed to subscribe to chat topics:", err);
    }
  }, [userId, stableOnMessage]);

  const subscribeToNotifications = useCallback(() => {
    if (
      !session?.user?.id ||
      !stompClient.current?.connected ||
      !enableNotifications
    ) {
      console.log(
        "⏳ Cannot subscribe to notifications: missing requirements or disabled"
      );
      return;
    }

    if (notificationSubscription.current) {
      console.log("🧹 Unsubscribing from previous notification subscription");
      notificationSubscription.current.unsubscribe();
      notificationSubscription.current = null;
    }

    try {
      console.log(
        `📝 Subscribing to notification topic: /user/queue/notifications`
      );
      const subscription = stompClient.current.subscribe(
        `/user/queue/notifications`,
        (message: IMessage) => {
          console.log("🔔 Received notification:", message);
          try {
            const notification: NotificationEvent = JSON.parse(message.body);
            console.log("✅ Parsed notification:", notification);
            stableOnNotification(notification);
          } catch (err) {
            console.error("❌ Failed to parse notification message:", err);
          }
        }
      );
      notificationSubscription.current = subscription;
      console.log("✅ Successfully subscribed to notifications");
      return subscription;
    } catch (err) {
      console.error("❌ Failed to subscribe to notifications:", err);
    }
  }, [session?.user?.id, stableOnNotification, enableNotifications]);

  const sendMessage = useCallback(
    (message: Omit<WebSocketMessage, "timestamp"> & { id?: string }) => {
      if (!stompClient.current || !stompClient.current.connected) {
        console.error("❌ Cannot send message: STOMP client not connected");
        setError("STOMP client is not connected");
        return;
      }

      const fullMessage: WebSocketMessage = {
        ...message,
        id: message.id || crypto.randomUUID(),
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

  const startChat = useCallback(
    (message: Omit<WebSocketMessage, "timestamp"> & { id?: string }) => {
      if (!stompClient.current || !stompClient.current.connected) {
        console.error("❌ Cannot start chat: STOMP client not connected");
        setError("STOMP client is not connected");
        return;
      }

      const fullMessage: WebSocketMessage = {
        ...message,
        id: message.id || crypto.randomUUID(),
        timestamp: new Date().toISOString(),
      };

      console.log("📤 Starting chat via /app/chat.sendMessage:", fullMessage);

      try {
        stompClient.current.publish({
          destination: "/app/chat.sendMessage",
          body: JSON.stringify(fullMessage),
        });
        console.log("✅ Chat started successfully");
      } catch (err) {
        console.error("❌ Failed to start chat:", err);
        setError("Failed to start chat");
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

    if (session?.access_token && url) {
      if (!stompClient.current?.active && !isConnecting) {
        console.log("🔄 Initiating WebSocket connection");
        connect();
      }
    } else {
      console.log("❌ Missing session or URL, disconnecting");
      disconnect();
    }
  }, [session?.access_token, url, connect, disconnect, isConnecting]);

  useEffect(() => {
    if (isConnected && userId) {
      console.log("🔄 Connection ready, subscribing to chat");
      const subscription = subscribeToChat();

      return () => {
        if (subscription) {
          console.log("🧹 Unsubscribing from chat topic");
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, userId, subscribeToChat]);

  useEffect(() => {
    if (isConnected && enableNotifications && session?.user?.id) {
      console.log("🔔 Connection ready, subscribing to notifications");
      const subscription = subscribeToNotifications();

      return () => {
        if (subscription) {
          console.log("🧹 Unsubscribing from notification topic");
          subscription.unsubscribe();
        }
      };
    }
  }, [
    isConnected,
    enableNotifications,
    session?.user?.id,
    subscribeToNotifications,
  ]);

  return {
    isConnected,
    isConnecting,
    error,
    sendMessage,
    startChat,
    disconnect,
    connect,
  };
}
