"use client";

import { useMemo, useCallback } from "react";
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
import { Skeleton } from "@/src/components/ui/skeleton";
import { useNotifications } from "@/src/hooks/notifications/use-notifications";
import { Bell, MessageCircle, Trash2, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    deleteNotification,
    isDeleting,
  } = useNotifications();

  const formatDate = useCallback((dateString: string) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  }, []);

  const getNotificationIcon = useCallback((type: string, isChat: boolean) => {
    if (isChat) {
      return <MessageCircle className="h-4 w-4" />;
    }
    return <Bell className="h-4 w-4" />;
  }, []);

  const getNotificationLink = useCallback((notification: any) => {
    if (notification.isChat && notification.metadata?.link) {
      return notification.metadata.link;
    }
    return notification.metadata?.link || "#";
  }, []);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      if (a.read === b.read) {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return a.read ? 1 : -1;
    });
  }, [notifications]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Notifications</h1>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-4" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">Notifications</h1>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-blue-500">
              {unreadCount} unread
            </Badge>
          )}
        </div>
        {/* {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            disabled={isMarkingAsRead}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all as read
          </Button>
        )} */}
      </div>

      {notifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-300 dark:text-gray-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No notifications yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              When you receive messages, item requests, or other updates,
              they'll appear here.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all duration-200 ${
                notification.read
                  ? "bg-gray-50 dark:bg-gray-800/50"
                  : "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800"
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-2">
                  {getNotificationIcon(
                    notification.type,
                    notification.isChat || false
                  )}
                  <CardTitle className="text-sm font-medium">
                    {notification.title}
                  </CardTitle>
                  {!notification.read && (
                    <Badge variant="default" className="bg-blue-500">
                      New
                    </Badge>
                  )}
                  {notification.isChat && (
                    <Badge variant="secondary" className="text-xs">
                      Chat
                    </Badge>
                  )}
                </div>
                <CardDescription className="text-xs">
                  {formatDate(notification.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
                  {notification.message}
                </p>
                <div className="flex justify-between items-center">
                  <Button asChild variant="outline" size="sm">
                    <Link href={getNotificationLink(notification)}>
                      View Details
                    </Link>
                  </Button>
                  <div className="flex items-center gap-2">
                    {/* {!notification.read && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        disabled={isMarkingAsRead}
                      >
                        Mark as Read
                      </Button>
                    )} */}
                    {!notification.isChat && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteNotification(notification.id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
