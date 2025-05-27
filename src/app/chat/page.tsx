"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/src/app/auth-provider";
import { useUserChats } from "@/src/hooks/chat/use-user-chats";
import ChatList from "@/src/components/chat/chat-list";
import ChatWindow from "@/src/components/chat/chat-window";
import { MessageCircle } from "lucide-react";
import { useChatId } from "@/src/hooks/chat/use-chat-id";

function ChatContent() {
  const { session } = useSession();
  const searchParams = useSearchParams();
  const { data: userChats = [], isLoading: isChatsLoading } = useUserChats();
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isUrlSelection, setIsUrlSelection] = useState(false);

  const itemId = searchParams.get("itemId");
  const autoStart = searchParams.get("autoStart") === "true";
  const hasSearchParams = Boolean(itemId);

  const {
    chatId,
    isLoading: isChatIdLoading,
    error: chatIdError,
  } = useChatId({
    itemId: itemId || "",
    userId: session?.user.user_metadata.user_id || "",
    enabled: hasSearchParams && Boolean(session?.user?.user_metadata?.user_id),
  });

  useEffect(() => {
    if (hasSearchParams && chatId) {
      setSelectedChatId(chatId);
      setIsUrlSelection(true);
    }
  }, [chatId, hasSearchParams]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsUrlSelection(false);
  };

  const selectedChat = userChats.find((chat) => chat.chatId === selectedChatId);

  if (isChatsLoading || (hasSearchParams && isChatIdLoading)) {
    return <ChatSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      <div className="w-80 flex-shrink-0 flex flex-col">
        <ChatList
          selectedChatId={selectedChatId}
          userChats={userChats}
          isLoading={false}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {selectedChat ? (
          <ChatWindow
            key={selectedChatId}
            item={selectedChat.item}
            otherUser={selectedChat.otherUser}
            chatId={selectedChatId}
            autoStart={isUrlSelection && autoStart}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center">
            <MessageCircle className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Welcome to Messages
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-md">
              Select a chat from the sidebar to start chatting, or start a new
              chat by messaging someone about an item.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatContent />
    </Suspense>
  );
}

function ChatSkeleton() {
  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden">
      <div className="w-80 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-6"></div>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 animate-pulse mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-72 animate-pulse"></div>
      </div>
    </div>
  );
}
