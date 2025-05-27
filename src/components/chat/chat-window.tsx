"use client";

import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { usePrivateChat } from "@/src/hooks/chat/use-private-chat";
import { useSession } from "@/src/app/auth-provider";
import { useTranslation } from "react-i18next";
import type { ChatMessage } from "@/src/types/chat";
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
}: {
  message: ChatMessage;
  isOwn: boolean;
  senderName?: string;
  showAvatar: boolean;
}) {
  const timeString = useMemo(
    () => format(new Date(message.timestamp), "HH:mm"),
    [message.timestamp]
  );

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      {!isOwn && showAvatar && (
        <Avatar className="h-8 w-8 mr-2">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs font-semibold">
            {senderName?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      {!isOwn && !showAvatar && <div className="w-10" />}

      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl relative ${
          isOwn
            ? "bg-blue-500 text-white"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <span
          className={`text-xs mt-1 block ${
            isOwn ? "text-blue-100" : "text-gray-500 dark:text-gray-400"
          }`}
        >
          {timeString}
        </span>
      </div>
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
    <div className="flex items-center justify-center my-6">
      <div className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
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
    return messages.reduce((groups: any[], message, index) => {
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

  const groupedMessagesRender = groupedMessages.map((item, index) => {
    if (item.type === "date") {
      return <DateSeparator key={`date-${index}`} date={item.date} />;
    }

    const isOwn = item.senderId === session?.user?.user_metadata?.user_id;
    return (
      <MessageBubble
        key={item.id}
        message={item}
        isOwn={isOwn}
        senderName={
          isOwn ? getUserDisplayName(session) || "You" : otherUser.name
        }
        showAvatar={item.showAvatar}
      />
    );
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-gray-900">
              <AvatarImage src={item.imageUrls[0]} alt={item.title} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white font-semibold">
                {otherUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                {otherUser.name}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {item.title}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4" ref={scrollRef}>
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`flex ${
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
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageCircle className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {t("chat.start_chat")}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-xs mb-4">
              {t("chat.send_message_about_item", { name: otherUser.name })}
            </p>
            {!isConnected && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  {t("chat.connecting")}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">{groupedMessagesRender}</div>
        )}
      </div>

      <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={messageInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder={t("chat.type_your_message")}
              className="pr-12 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Button
            onClick={handleSendMessage}
            disabled={!messageInput.trim() || !isConnected}
            size="sm"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4"
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
