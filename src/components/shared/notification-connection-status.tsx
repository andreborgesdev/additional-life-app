import React from "react";
import { Badge } from "@/src/components/ui/badge";
import { useNotificationContext } from "@/src/contexts/notication-context";

export function NotificationConnectionStatus() {
  const { isWebSocketConnected, isWebSocketConnecting, webSocketError } =
    useNotificationContext();

  if (webSocketError) {
    return (
      <Badge variant="destructive" className="text-xs">
        Notifications Error
      </Badge>
    );
  }

  if (isWebSocketConnecting) {
    return (
      <Badge variant="outline" className="text-xs">
        Connecting...
      </Badge>
    );
  }

  if (isWebSocketConnected) {
    return (
      <Badge variant="default" className="text-xs bg-green-500">
        Live Notifications
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="text-xs">
      Offline
    </Badge>
  );
}
