"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ChatList from "@/src/components/chat/chat-list";
import ChatWindow from "@/src/components/chat/chat-window";
import { MessageCircle } from "lucide-react";

function ChatContent() {
  const searchParams = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<{
    itemId: string;
    userId: string;
    userName: string;
  } | null>(null);

  useEffect(() => {
    const itemId = searchParams.get("itemId");
    const otherUserId = searchParams.get("otherUserId");
    const otherUserName = searchParams.get("otherUserName");

    if (itemId && otherUserId && otherUserName) {
      setSelectedChat({
        itemId,
        userId: otherUserId,
        userName: decodeURIComponent(otherUserName),
      });
    }
  }, [searchParams]);

  const handleSelectChat = (
    itemId: string,
    userId: string,
    userName: string
  ) => {
    setSelectedChat({ itemId, userId, userName });
  };

  return (
    <div className="h-screen flex">
      <div className="w-80 flex-shrink-0">
        <ChatList
          selectedChatId={
            selectedChat
              ? `${selectedChat.itemId}-${selectedChat.userId}`
              : undefined
          }
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className="flex-1">
        {selectedChat ? (
          <ChatWindow
            itemId={selectedChat.itemId}
            otherUserId={selectedChat.userId}
            otherUserName={selectedChat.userName}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center">
            <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Messages
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Select a conversation from the sidebar to start chatting, or start
              a new conversation by messaging someone about an item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Loading chat...</p>
          </div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  );
}
