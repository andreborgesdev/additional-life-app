import { useCallback, useEffect, useRef, useState } from "react";
import { Client, IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { useSession } from "@/src/app/auth-provider";
import { NotificationEvent } from "@/src/types/chat";

interface UseNotificationsWebSocketOptions {
  url: string;
  onNotification?: (notification: NotificationEvent) => void;
  onError?: (error: Event) => void;
  onOpen?: () => void;
  onClose?: () => void;
  reconnectAttempts?: number;
  reconnectDelay?: number;
  enabled?: boolean;
}

interface UseNotificationsWebSocketReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  disconnect: () => void;
  connect: () => void;
}

export function useNotificationsWebSocket({
  url,
  onNotification,
  onError,
  onOpen,
  onClose,
  reconnectAttempts = 3,
  reconnectDelay = 1000,
  enabled = true,
}: UseNotificationsWebSocketOptions): UseNotificationsWebSocketReturn {
  const { session } = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stompClient = useRef<Client | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnect = useRef(true);
  const notificationSubscription = useRef<any>(null);

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
      console.log(
        "❌ Notifications WebSocket connection failed: No access token"
      );
      return;
    }

    if (!url) {
      setError("WebSocket URL is required");
      console.log(
        "❌ Notifications WebSocket connection failed: No URL provided"
      );
      return;
    }

    if (!enabled) {
      console.log("⏸️ Notifications WebSocket disabled");
      return;
    }

    if (stompClient.current?.active) {
      console.log("✅ Notifications WebSocket already active, skipping");
      return;
    }

    if (isConnecting) {
      console.log("⏳ Notifications connection already in progress, skipping");
      return;
    }

    setIsConnecting(true);
    setError(null);
    console.log("🔔 Attempting notifications WebSocket connection to:", url);

    try {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }

      stompClient.current = new Client({
        webSocketFactory: () => {
          console.log("🏭 Creating SockJS connection for notifications...");
          return new SockJS(url);
        },
        connectHeaders: {
          Authorization: `Bearer ${session.access_token}`,
        },
        debug: (str) => {
          console.log("📡 Notifications STOMP Debug:", str);
        },
        reconnectDelay: 0,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        onConnect: (frame) => {
          console.log("✅ Notifications STOMP connection established:", frame);
          setIsConnected(true);
          setIsConnecting(false);
          setError(null);
          reconnectCount.current = 0;
          stableOnOpen();
        },
        onDisconnect: (frame) => {
          console.log("❌ Notifications STOMP disconnected:", frame);
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
              `🔄 Reconnecting notifications in ${delay}ms (attempt ${reconnectCount.current}/${reconnectAttempts})`
            );
            reconnectTimer.current = setTimeout(() => {
              if (shouldReconnect.current) {
                connect();
              }
            }, delay);
          }
        },
        onStompError: (frame) => {
          console.error("❌ Notifications STOMP error:", frame);
          setError(
            `Notifications STOMP error: ${
              frame.headers["message"] || frame.body || "Unknown error"
            }`
          );
          setIsConnecting(false);
          stableOnError(new Event("stomp-error"));
        },
        onWebSocketError: (event) => {
          console.error("❌ Notifications WebSocket error:", event);
          setError("Notifications WebSocket connection error");
          setIsConnecting(false);
          stableOnError(event);
        },
      });

      stompClient.current.activate();
    } catch (err) {
      console.error("❌ Failed to create notifications STOMP connection:", err);
      setError("Failed to create notifications STOMP connection");
      setIsConnecting(false);
    }
  }, [
    url,
    session?.access_token,
    enabled,
    stableOnOpen,
    stableOnError,
    stableOnClose,
    reconnectAttempts,
    reconnectDelay,
    isConnecting,
  ]);

  const subscribeToNotifications = useCallback(() => {
    if (!session?.user?.id || !stompClient.current?.connected) {
      console.log("⏳ Cannot subscribe to notifications: missing requirements");
      return;
    }

    if (notificationSubscription.current) {
      console.log("🧹 Unsubscribing from previous notification subscription");
      notificationSubscription.current.unsubscribe();
      notificationSubscription.current = null;
    }

    try {
      console.log(
        `🔔 Subscribing to notification topic: /user/queue/notifications`
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
  }, [session?.user?.id, stableOnNotification]);

  useEffect(() => {
    return () => {
      shouldReconnect.current = false;
      disconnect();
    };
  }, [disconnect]);

  useEffect(() => {
    shouldReconnect.current = true;

    if (session?.access_token && url && enabled) {
      if (!stompClient.current?.active && !isConnecting) {
        console.log("🔔 Initiating notifications WebSocket connection");
        connect();
      }
    } else {
      console.log(
        "❌ Missing session, URL, or notifications disabled, disconnecting"
      );
      disconnect();
    }
  }, [session?.access_token, url, enabled, connect, disconnect, isConnecting]);

  useEffect(() => {
    if (isConnected && session?.user?.id) {
      console.log("🔔 Connection ready, subscribing to notifications");
      const subscription = subscribeToNotifications();

      return () => {
        if (subscription) {
          console.log("🧹 Unsubscribing from notification topic");
          subscription.unsubscribe();
        }
      };
    }
  }, [isConnected, session?.user?.id, subscribeToNotifications]);

  return {
    isConnected,
    isConnecting,
    error,
    disconnect,
    connect,
  };
}
