"use client";

import { useState } from "react";
import { useChat } from "@/src/contexts/chat-context";
import { useUser } from "@/src/hooks/users/use-user";
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

interface ChatListProps {
  selectedChatId?: string;
  onSelectChat: (itemId: string, userId: string, userName: string) => void;
}

function ChatListItem({
  notification,
  isSelected,
  onSelect,
}: {
  notification: any;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const { data: user, isLoading } = useUser(notification.fromUserId);

  if (isLoading) {
    return (
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    );
  }

  const timeAgo = formatDistanceToNow(new Date(notification.timestamp), {
    addSuffix: true,
  });

  return (
    <div
      onClick={onSelect}
      className={`p-4 border-b border-gray-100 dark:border-gray-800 cursor-pointer transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
        isSelected
          ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
          : ""
      }`}
    >
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-gray-900">
            <AvatarImage
              src={user?.avatarUrl}
              alt={notification.fromUserName}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
              {notification.fromUserName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {notification.fromUserName}
            </h3>
            <div className="flex items-center space-x-2">
              {notification.unreadCount > 0 && (
                <Badge
                  variant="default"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 text-xs"
                >
                  {notification.unreadCount}
                </Badge>
              )}
              <span className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                {timeAgo}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
            {notification.lastMessage}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ChatList({
  selectedChatId,
  onSelectChat,
}: ChatListProps) {
  const { notifications, isLoading } = useChat();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotifications = notifications.filter((notification) =>
    notification.fromUserName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <MessageCircle className="h-6 w-6 mr-2 text-blue-500" />
            Messages
          </h2>
          {notifications.length > 0 && (
            <Badge variant="secondary" className="bg-gray-100 text-gray-700">
              {notifications.length}
            </Badge>
          )}
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <ScrollArea className="flex-1">
        {isLoading ? (
          <div className="space-y-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="p-4 border-b border-gray-100 dark:border-gray-800"
              >
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-6">
            <MessageCircle className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs">
              {searchQuery
                ? "Try searching with different keywords"
                : "Start a conversation by messaging someone about an item"}
            </p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <ChatListItem
              key={`${notification.itemId}-${notification.fromUserId}`}
              notification={notification}
              isSelected={
                selectedChatId ===
                `${notification.itemId}-${notification.fromUserId}`
              }
              onSelect={() =>
                onSelectChat(
                  notification.itemId,
                  notification.fromUserId,
                  notification.fromUserName
                )
              }
            />
          ))
        )}
      </ScrollArea>
    </div>
  );
}
