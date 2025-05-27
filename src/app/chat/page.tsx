"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/src/app/auth-provider";
import { useUserChats } from "@/src/hooks/chat/use-user-chats";
import ChatList from "@/src/components/chat/chat-list";
import ChatWindow from "@/src/components/chat/chat-window";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useChatId } from "@/src/hooks/chat/use-chat-id";
import { Button } from "@/src/components/ui/button";

function ChatContent() {
  const { session } = useSession();
  const searchParams = useSearchParams();
  const { data: userChats = [], isLoading: isChatsLoading } = useUserChats();
  const [selectedChatId, setSelectedChatId] = useState<string>("");
  const [isUrlSelection, setIsUrlSelection] = useState(false);
  const [isMobileViewOpen, setIsMobileViewOpen] = useState(false);

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
      setIsMobileViewOpen(true);
    }
  }, [chatId, hasSearchParams]);

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    setIsUrlSelection(false);
    setIsMobileViewOpen(true);
  };

  const handleBackToList = () => {
    setIsMobileViewOpen(false);
    setSelectedChatId("");
  };

  const selectedChat = userChats.find((chat) => chat.chatId === selectedChatId);

  if (isChatsLoading || (hasSearchParams && isChatIdLoading)) {
    return <ChatSkeleton />;
  }

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div
        className={`w-full md:w-80 lg:w-96 flex-shrink-0 ${
          isMobileViewOpen ? "hidden md:flex" : "flex"
        } flex-col border-r border-gray-200/50 dark:border-gray-700/50`}
      >
        <ChatList
          selectedChatId={selectedChatId}
          userChats={userChats}
          isLoading={false}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div
        className={`flex-1 flex flex-col min-w-0 ${
          !isMobileViewOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {selectedChat ? (
          <div className="h-full flex flex-col">
            <div className="md:hidden flex items-center p-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToList}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                Back to chats
              </span>
            </div>
            <ChatWindow
              key={selectedChatId}
              item={selectedChat.item}
              otherUser={selectedChat.otherUser}
              chatId={selectedChatId}
              autoStart={isUrlSelection && autoStart}
            />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900 text-center p-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200/50 dark:border-gray-700/50 max-w-md w-full">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                Welcome to Messages
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                Select a conversation from the sidebar to start chatting, or
                begin a new conversation about an item you're interested in.
              </p>
            </div>
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
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-gray-50 dark:bg-gray-900">
      <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-gray-200/50 dark:border-gray-700/50 flex flex-col bg-white dark:bg-gray-800">
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-3"></div>
          <div className="h-10 bg-gray-100 dark:bg-gray-700/50 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/30"
              >
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-600 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-900">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse mx-auto mb-6"></div>
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
