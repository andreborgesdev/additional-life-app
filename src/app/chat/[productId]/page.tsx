"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Avatar, AvatarFallback } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { ScrollArea } from "@/src/components/ui/scroll-area";

interface Message {
  id: string;
  sender: "buyer" | "seller";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const { productId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // In a real application, you would fetch the chat history from an API
    const mockMessages: Message[] = [
      {
        id: "1",
        sender: "buyer",
        content: "Hi, is this item still available?",
        timestamp: new Date(2023, 5, 1, 14, 30),
      },
      {
        id: "2",
        sender: "seller",
        content: "Yes, it is! Are you interested?",
        timestamp: new Date(2023, 5, 1, 14, 35),
      },
      {
        id: "3",
        sender: "buyer",
        content: "Great! Can I pick it up tomorrow?",
        timestamp: new Date(2023, 5, 1, 14, 40),
      },
      {
        id: "4",
        sender: "seller",
        content: "Sure, that works for me. What time?",
        timestamp: new Date(2023, 5, 1, 14, 45),
      },
    ];
    setMessages(mockMessages);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "buyer", // Assuming the current user is the buyer
      content: newMessage,
      timestamp: new Date(),
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Chat about Product #{productId}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] w-full pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "buyer" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start ${
                    message.sender === "buyer" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.sender === "buyer" ? "B" : "S"}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`mx-2 ${
                      message.sender === "buyer" ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`px-4 py-2 rounded-lg ${
                        message.sender === "buyer"
                          ? "bg-green-500 text-white"
                          : "bg-gray-200 dark:bg-gray-700"
                      }`}
                    >
                      {message.content}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form onSubmit={handleSendMessage} className="w-full flex">
            <Input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow mr-2"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
