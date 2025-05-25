"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/src/hooks/use-websocket";
import { useSession } from "@/src/app/auth-provider";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";

export function WebSocketTest() {
  const { session } = useSession();
  const [messages, setMessages] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  const { isConnected, isConnecting, error, sendMessage, startConversation } =
    useWebSocket({
      url: process.env.NEXT_PUBLIC_WEBSOCKET_URL,
      conversationId: "test-conversation-123",
      onMessage: (message) => {
        const timestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [
          ...prev,
          `[${timestamp}] Received: ${JSON.stringify(message, null, 2)}`,
        ]);
      },
      onOpen: () => {
        const timestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [
          ...prev,
          `[${timestamp}] ✅ Connected to WebSocket`,
        ]);
        setDebugInfo((prev) => [
          ...prev,
          `[${timestamp}] STOMP connection established`,
        ]);
      },
      onClose: () => {
        const timestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [
          ...prev,
          `[${timestamp}] ❌ Disconnected from WebSocket`,
        ]);
        setDebugInfo((prev) => [
          ...prev,
          `[${timestamp}] STOMP connection closed`,
        ]);
      },
      onError: (error) => {
        const timestamp = new Date().toLocaleTimeString();
        setMessages((prev) => [...prev, `[${timestamp}] ⚠️ Error: ${error}`]);
        setDebugInfo((prev) => [
          ...prev,
          `[${timestamp}] WebSocket error occurred`,
        ]);
      },
    });

  const handleSendMessage = () => {
    if (inputMessage.trim() && isConnected) {
      const timestamp = new Date().toLocaleTimeString();
      const messageToSend = {
        conversationId: "test-conversation-123",
        itemId: "test-item-123",
        senderId: session?.user?.id || "test-user",
        senderName: session?.user?.user_metadata?.full_name || "Test User",
        recipientId: "test-recipient",
        content: inputMessage,
        type: "CHAT" as const,
      };

      sendMessage(messageToSend);
      setMessages((prev) => [
        ...prev,
        `[${timestamp}] 📤 Sent: ${inputMessage}`,
      ]);
      setDebugInfo((prev) => [
        ...prev,
        `[${timestamp}] Message sent to /app/chat.sendMessage`,
      ]);
      setInputMessage("");
    }
  };

  const handleStartConversation = () => {
    if (inputMessage.trim() && isConnected) {
      const timestamp = new Date().toLocaleTimeString();
      const messageToSend = {
        conversationId: "test-conversation-123",
        itemId: "test-item-123",
        senderId: session?.user?.id || "test-user",
        senderName: session?.user?.user_metadata?.full_name || "Test User",
        recipientId: "test-recipient",
        content: inputMessage,
        type: "JOIN" as const,
      };

      startConversation(messageToSend);
      setMessages((prev) => [
        ...prev,
        `[${timestamp}] 🚀 Started conversation: ${inputMessage}`,
      ]);
      setDebugInfo((prev) => [
        ...prev,
        `[${timestamp}] Conversation started via /app/chat.startConversation`,
      ]);
      setInputMessage("");
    }
  };

  const connectionStatus = isConnecting
    ? "Connecting..."
    : isConnected
    ? "Connected"
    : "Disconnected";

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">WebSocket Connection Test</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="space-y-2">
          <p>
            <strong>Connection Status:</strong>
            <span
              className={`ml-2 px-2 py-1 rounded text-sm ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : isConnecting
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {connectionStatus}
            </span>
          </p>
          <p>
            <strong>User ID:</strong> {session?.user?.id || "Not logged in"}
          </p>
          <p>
            <strong>User Email:</strong>{" "}
            {session?.user?.email || "Not available"}
          </p>
          <p>
            <strong>Token Available:</strong>{" "}
            {session?.access_token ? "✅ Yes" : "❌ No"}
          </p>
          {error && (
            <p className="text-red-500">
              <strong>Error:</strong> {error}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Backend Configuration:</h4>
          <p className="text-sm">
            <strong>WebSocket URL:</strong>{" "}
            {process.env.NEXT_PUBLIC_WEBSOCKET_URL}
          </p>
          <p className="text-sm">
            <strong>API URL:</strong>{" "}
            {process.env.API_URL || "http://localhost:8080"}
          </p>
          <p className="text-sm">
            <strong>Send Destination:</strong> /app/chat.sendMessage
          </p>
          <p className="text-sm">
            <strong>Subscribe Topics:</strong>{" "}
            /topic/chat/test-conversation-123, /topic/public
          </p>
          <p className="text-sm">
            <strong>Protocol:</strong> STOMP over SockJS
          </p>
          <p className="text-sm text-red-500">
            <strong>Issue:</strong> CORS not configured for localhost:3000
          </p>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type a test message..."
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={!isConnected}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!isConnected || !inputMessage.trim()}
            className="whitespace-nowrap"
          >
            Send Message
          </Button>
          <Button
            onClick={handleStartConversation}
            disabled={!isConnected || !inputMessage.trim()}
            variant="outline"
            className="whitespace-nowrap"
          >
            Start Conversation
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <h4 className="font-medium">Chat Messages:</h4>
          <div className="max-h-60 overflow-y-auto bg-gray-50 rounded p-3 space-y-1">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">No messages yet...</p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-white rounded border"
                >
                  <pre className="whitespace-pre-wrap font-mono text-xs">
                    {msg}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Debug Info:</h4>
          <div className="max-h-60 overflow-y-auto bg-blue-50 rounded p-3 space-y-1">
            {debugInfo.length === 0 ? (
              <p className="text-gray-500 text-sm">No debug info yet...</p>
            ) : (
              debugInfo.map((info, index) => (
                <div
                  key={index}
                  className="text-sm p-2 bg-white rounded border"
                >
                  {info}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
