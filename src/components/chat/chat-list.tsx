import { useState, useMemo, useCallback, memo } from "react";
import { useSession } from "@/src/app/auth-provider";
import { ChatListItem } from "@/src/types/chat";
import { extractItemIdFromChatId } from "@/src/hooks/chat/use-user-chats";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { Skeleton } from "@/src/components/ui/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Search, MessageCircle, Clock, Send, Inbox } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ChatErrorBoundary } from "./chat-error-boundary";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
              src={chat.item.imageUrls?.[0]}
              alt={chat.otherUser.name}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-sm">
              {chat.otherUser.name.slice(0, 1).toUpperCase()}
            </AvatarFallback>
          </Avatar>
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
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate flex-1">
              🏷️ {chat.item.title}
            </p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1 leading-relaxed">
            {chat.lastMessage}
          </p>
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
  const { session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const currentUserId = session?.user?.user_metadata?.user_id;

  const { sentChats, receivedChats } = useMemo(() => {
    if (!currentUserId) return { sentChats: [], receivedChats: [] };

    return userChats.reduce(
      (acc, chat) => {
        const isUserOwner = chat.item.owner.id === currentUserId;
        if (isUserOwner) {
          acc.receivedChats.push(chat);
        } else {
          acc.sentChats.push(chat);
        }
        return acc;
      },
      { sentChats: [] as ChatListItem[], receivedChats: [] as ChatListItem[] }
    );
  }, [userChats, currentUserId]);

  const getFilteredChats = useCallback(
    (chats: ChatListItem[]) => {
      if (!searchQuery) return chats;
      return chats.filter(
        (chat) =>
          chat.item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chat.otherUser.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    },
    [searchQuery]
  );

  const filteredSentChats = useMemo(
    () => getFilteredChats(sentChats),
    [getFilteredChats, sentChats]
  );
  const filteredReceivedChats = useMemo(
    () => getFilteredChats(receivedChats),
    [getFilteredChats, receivedChats]
  );
  const filteredAllChats = useMemo(
    () => getFilteredChats(userChats),
    [getFilteredChats, userChats]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const renderChatList = useCallback(
    (chats: ChatListItem[], emptyMessage: string) => {
      if (isLoading) {
        return (
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
        );
      }

      if (chats.length === 0) {
        return (
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
                : emptyMessage}
            </p>
          </div>
        );
      }

      return (
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {chats.map((chat) => (
            <UserChatListItemWrapper
              key={chat.chatId}
              chat={chat}
              isSelected={selectedChatId === chat.chatId}
              onSelectChat={onSelectChat}
              searchQuery={searchQuery}
            />
          ))}
        </div>
      );
    },
    [isLoading, searchQuery, selectedChatId, onSelectChat]
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Messages
        </h2>
        <div className="relative mb-4">
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

      <div className="flex-1 overflow-hidden">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="h-full flex flex-col"
        >
          <div className="flex-shrink-0 px-4 py-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                All ({userChats.length})
              </TabsTrigger>
              <TabsTrigger value="received" className="flex items-center gap-2">
                <Inbox className="h-4 w-4" />
                Received ({receivedChats.length})
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex items-center gap-2">
                <Send className="h-4 w-4" />
                Sent ({sentChats.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto">
            <TabsContent value="all" className="mt-0 h-full">
              {renderChatList(
                filteredAllChats,
                "Start chatting by messaging someone about an item you're interested in"
              )}
            </TabsContent>

            <TabsContent value="received" className="mt-0 h-full">
              {renderChatList(
                filteredReceivedChats,
                "No one has messaged you about your items yet"
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-0 h-full">
              {renderChatList(
                filteredSentChats,
                "Start chatting by messaging someone about an item you're interested in"
              )}
            </TabsContent>
          </div>
        </Tabs>
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
