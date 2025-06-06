"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { usePrivateChat } from "@/src/hooks/chat/use-private-chat";
import { useSession } from "@/src/app/auth-provider";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "@/src/types/chat";

type DateSeparatorItem = {
  type: "date";
  date: Date;
};

type MessageWithMeta = ChatMessage & {
  showAvatar: boolean;
};

type GroupedMessageItem = DateSeparatorItem | MessageWithMeta;

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";
import { getUserDisplayName } from "@/src/utils/user-metadata-utils";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Send, Wifi, WifiOff, MessageCircle } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";
import { ChatErrorBoundary } from "./chat-error-boundary";
import { ItemResponse, MinimalUserResponse } from "@/src/lib/generated-api";

interface ChatWindowProps {
  item: ItemResponse;
  otherUser: MinimalUserResponse;
  chatId?: string;
  autoStart?: boolean;
}

const MessageBubble = memo(function MessageBubble({
  message,
  isOwn,
  senderName,
  showAvatar,
  avatarUrl,
}: {
  message: ChatMessage;
  isOwn: boolean;
  senderName?: string;
  showAvatar: boolean;
  avatarUrl?: string;
}) {
  const timeString = useMemo(
    () => format(new Date(message.timestamp), "HH:mm"),
    [message.timestamp]
  );

  return (
    <div
      className={`flex mb-4 px-4 ${isOwn ? "justify-end" : "justify-start"}`}
    >
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mr-3 mt-auto flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={senderName} />
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs font-semibold">
            {senderName?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!isOwn && !showAvatar && <div className="w-11 mr-3" />}

      <div
        className={`flex flex-col max-w-[80%] sm:max-w-[70%] ${
          isOwn ? "items-end" : "items-start"
        }`}
      >
        <div
          className={`px-4 py-3 rounded-2xl shadow-sm break-words ${
            isOwn
              ? "bg-blue-500 text-white rounded-br-md ml-auto"
              : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-gray-600/50 rounded-bl-md"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.content}
          </p>
        </div>
        <span
          className={`text-xs mt-1 px-1 ${
            isOwn
              ? "text-gray-500 dark:text-gray-400"
              : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {timeString}
        </span>
      </div>

      {isOwn && showAvatar && (
        <Avatar className="h-8 w-8 ml-3 mt-auto flex-shrink-0">
          <AvatarImage src={avatarUrl} alt={senderName} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xs font-semibold">
            {senderName?.slice(0, 1).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {isOwn && !showAvatar && <div className="w-11 ml-3" />}
    </div>
  );
});

const DateSeparator = memo(function DateSeparator({ date }: { date: Date }) {
  const { t } = useTranslation("common");
  let label = format(date, "MMMM d, yyyy");

  if (isToday(date)) {
    label = t("dates.today");
  } else if (isYesterday(date)) {
    label = t("dates.yesterday");
  }

  return (
    <div className="flex items-center justify-center my-6 px-4">
      <div className="bg-gray-100 dark:bg-gray-700/50 px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-600/50">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          {label}
        </span>
      </div>
    </div>
  );
});

const ChatWindow = memo(function ChatWindow({
  item,
  otherUser,
  chatId: providedChatId,
  autoStart = false,
}: ChatWindowProps) {
  const { session } = useSession();
  const { t } = useTranslation("common");
  const [messageInput, setMessageInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const autoStartSentRef = useRef(false);
  const chatKeyRef = useRef("");

  const {
    messages,
    isLoading,
    isConnected,
    error,
    chatId,
    peerOnline,
    sendMessage,
    markAsRead,
  } = usePrivateChat({
    itemId: item.id,
    otherUserId: otherUser.id,
    ownUserId: session?.user.user_metadata.user_id || "",
    chatId: providedChatId,
  });

  const handleSendMessage = useCallback(() => {
    if (messageInput.trim()) {
      const isFirstMessage = messages.length === 0;
      sendMessage(messageInput.trim(), isFirstMessage);
      setMessageInput("");
      inputRef.current?.focus();
    }
  }, [messageInput, sendMessage, messages.length]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setMessageInput(e.target.value);
    },
    []
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const groupedMessages = useMemo(() => {
    return messages.reduce((groups: GroupedMessageItem[], message, index) => {
      const messageDate = new Date(message.timestamp);
      const prevMessage = messages[index - 1];
      const showDateSeparator =
        !prevMessage ||
        (!isToday(messageDate) &&
          format(messageDate, "yyyy-MM-dd") !==
            format(new Date(prevMessage.timestamp), "yyyy-MM-dd"));

      if (showDateSeparator) {
        groups.push({ type: "date", date: messageDate });
      }

      const showAvatar =
        !prevMessage ||
        prevMessage.senderId !== message.senderId ||
        new Date(message.timestamp).getTime() -
          new Date(prevMessage.timestamp).getTime() >
          300000;

      groups.push({ ...message, showAvatar });
      return groups;
    }, []);
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && chatId) {
      markAsRead();
    }
  }, [messages.length, chatId]);

  useEffect(() => {
    if (inputRef.current && isConnected) {
      inputRef.current.focus();
    }
  }, [isConnected]);

  useEffect(() => {
    const newChatKey = `${item?.id}-${otherUser?.id}`;
    if (chatKeyRef.current !== newChatKey) {
      autoStartSentRef.current = false;
      chatKeyRef.current = newChatKey;
    }
  }, [item?.id, otherUser?.id]);

  useEffect(() => {
    if (
      autoStart &&
      isConnected &&
      messages.length === 0 &&
      item?.title &&
      !isLoading &&
      !autoStartSentRef.current
    ) {
      const initialMessage = t("interested_in_item", { title: item.title });
      sendMessage(initialMessage, true);
      autoStartSentRef.current = true;
    }
  }, [
    autoStart,
    isConnected,
    messages.length,
    item?.title,
    isLoading,
    sendMessage,
    t,
  ]);

  const groupedMessagesRender = groupedMessages.map((messageItem, index) => {
    if (messageItem.type === "date") {
      return <DateSeparator key={`date-${index}`} date={messageItem.date} />;
    }

    const isOwn =
      messageItem.senderId === session?.user?.user_metadata?.user_id;
    const senderName = isOwn
      ? getUserDisplayName(session) || "You"
      : otherUser.name;

    return (
      <MessageBubble
        key={messageItem.id}
        message={messageItem}
        isOwn={isOwn}
        senderName={senderName}
        showAvatar={messageItem.showAvatar}
        avatarUrl={
          isOwn ? session?.user?.user_metadata?.avatar_url : otherUser.avatarUrl
        }
      />
    );
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="h-11 w-11 ring-2 ring-white dark:ring-gray-800 shadow-sm">
              <AvatarImage src={item.imageUrls?.[0]} alt={otherUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold">
                {otherUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {peerOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-sm truncate">
              {otherUser.name}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              📦 {item.title}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {isConnected && peerOnline ? (
              <div className="flex items-center text-green-500">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                <span className="text-xs hidden sm:inline">Online</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <div className="w-2 h-2 bg-gray-400 rounded-full mr-1"></div>
                <span className="text-xs hidden sm:inline">Offline</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50/30 to-white dark:from-gray-900/30 dark:to-gray-800"
        ref={scrollRef}
      >
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4 p-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex px-4 ${
                  i % 2 === 0 ? "justify-start" : "justify-end"
                }`}
              >
                <Skeleton
                  className={`h-12 ${
                    i % 2 === 0 ? "w-48" : "w-32"
                  } rounded-2xl`}
                />
              </div>
            ))}
          </div>
        ) : groupedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Start your conversation
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mb-6">
              Send a message to {otherUser.name} about {item.title}
            </p>
            {!isConnected && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 max-w-sm">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Connecting to chat...
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="py-4 space-y-1">{groupedMessagesRender}</div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 bg-white dark:bg-gray-800 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="min-h-[44px] max-h-32 pr-4 bg-gray-50 dark:bg-gray-700/50 border-gray-200/50 dark:border-gray-600/50 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            size="sm"
            className="h-11 w-11 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-full shadow-sm transition-all"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
});

const ChatWindowWithErrorBoundary = memo(function ChatWindowWithErrorBoundary(
  props: ChatWindowProps
) {
  return (
    <ChatErrorBoundary>
      <ChatWindow {...props} />
    </ChatErrorBoundary>
  );
});

export default ChatWindowWithErrorBoundary;
