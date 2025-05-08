"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";

interface Notification {
  id: string;
  title: string;
  description: string;
  date: string;
  read: boolean;
  link: string;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // In a real application, you would fetch the notifications from an API
    const mockNotifications: Notification[] = [
      {
        id: "1",
        title: "New message about your item",
        description: "John Doe sent you a message about the Vintage Bicycle.",
        date: "2023-06-15T10:30:00Z",
        read: false,
        link: "/chat/1",
      },
      {
        id: "2",
        title: "Item request",
        description: "Jane Smith requested your Wooden Bookshelf.",
        date: "2023-06-14T15:45:00Z",
        read: false,
        link: "/product/2",
      },
      {
        id: "3",
        title: "Reminder: Item pickup",
        description: "Don't forget to pick up the Potted Plants today at 5 PM.",
        date: "2023-06-13T09:00:00Z",
        read: true,
        link: "/product/3",
      },
    ];
    setNotifications(mockNotifications);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notifications</h1>
      <div className="space-y-4">
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={
              notification.read
                ? "bg-gray-50 dark:bg-gray-800"
                : "bg-white dark:bg-gray-700"
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {notification.title}
                {!notification.read && (
                  <Badge variant="destructive" className="ml-2">
                    New
                  </Badge>
                )}
              </CardTitle>
              <CardDescription className="text-xs">
                {formatDate(notification.date)}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{notification.description}</p>
              <div className="flex justify-between items-center mt-4">
                <Button asChild variant="outline" size="sm">
                  <Link href={notification.link}>View Details</Link>
                </Button>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as Read
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
