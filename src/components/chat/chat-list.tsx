import { useState, useMemo, useCallback, memo } from "react";
import { useSession } from "@/src/app/auth-provider";
import { ChatListItem } from "@/src/types/chat";
import { extractItemIdFromChatId } from "@/src/hooks/chat/use-user-chats";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Search, MessageCircle, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatErrorBoundary } from "./chat-error-boundary";

interface ChatListProps {
  selectedChatId?: string;
  userChats?: ChatListItem[];
  isLoading?: boolean;
  onSelectChat: (chatId: string) => void;
}

const ChatListItemComponent = memo(function ChatListItemComponent({
  chat,
  isSelected,
  onSelect,
}: {
  chat: ChatListItem;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const timeAgo = useMemo(
    () => formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true }),
    [chat.lastMessage]
  );

  return (
    <div
      onClick={onSelect}
      className={`
        relative p-4 cursor-pointer transition-all duration-200 group
        hover:bg-gray-50 dark:hover:bg-gray-700/50
        ${
          isSelected
            ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-r-2 border-blue-500"
            : "border-b border-gray-100 dark:border-gray-700/50"
        }
      `}
    >
      <div className="flex items-center space-x-3">
        <div className="relative flex-shrink-0">
          <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-800 shadow-sm">
            <AvatarImage
              src={chat.item.imageUrls[0] || chat.otherUser.avatarUrl}
              alt={chat.otherUser.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {chat.otherUser.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
              {chat.otherUser.name}
            </h3>
            <div className="flex items-center space-x-2 flex-shrink-0">
              {chat.unreadMessagesCount > 0 && (
                <Badge className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-0.5 text-xs font-medium">
                  {chat.unreadMessagesCount}
                </Badge>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {timeAgo.replace("about ", "")}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1 leading-relaxed">
            {chat.lastMessage}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
              📦 {chat.item.title}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

const UserChatListItemWrapper = memo(function UserChatListItemWrapper({
  chat,
  isSelected,
  onSelectChat,
  searchQuery,
}: {
  chat: ChatListItem;
  isSelected: boolean;
  onSelectChat: (chatId: string) => void;
  searchQuery: string;
}) {
  const itemId = chat.item.id;
  const otherUserName = chat.otherUser.name;

  const matchesSearch = useMemo(
    () =>
      !searchQuery ||
      chat.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      otherUserName.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery, chat.item.title, otherUserName]
  );

  const handleSelect = useCallback(
    () => onSelectChat(chat.chatId),
    [onSelectChat, chat.chatId]
  );

  if (!matchesSearch) {
    return null;
  }

  return (
    <ChatListItemComponent
      chat={chat}
      isSelected={isSelected}
      onSelect={handleSelect}
    />
  );
});

const ChatList = memo(function ChatList({
  selectedChatId,
  userChats = [],
  isLoading = false,
  onSelectChat,
}: ChatListProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = useMemo(
    () =>
      userChats.filter((chat) => {
        if (!searchQuery) return true;

        return (
          chat.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }),
    [userChats, searchQuery]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const totalChats = filteredChats.length;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Messages
        </h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="pl-10 h-10 bg-gray-50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="space-y-1 p-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-4 rounded-lg bg-gray-50/50 dark:bg-gray-700/20"
              >
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : totalChats === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center h-full">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? "No chats found" : "No messages yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs">
              {searchQuery
                ? "Try searching with different keywords"
                : "Start chatting by messaging someone about an item you're interested in"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
            {filteredChats.map((chat) => (
              <UserChatListItemWrapper
                key={chat.chatId}
                chat={chat}
                isSelected={selectedChatId === chat.chatId}
                onSelectChat={onSelectChat}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

const ChatListWithErrorBoundary = memo(function ChatListWithErrorBoundary(
  props: ChatListProps
) {
  return (
    <ChatErrorBoundary>
      <ChatList {...props} />
    </ChatErrorBoundary>
  );
});

export default ChatListWithErrorBoundary;
