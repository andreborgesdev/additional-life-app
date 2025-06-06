import { ChatMessage, ChatListItem } from "@/src/types/chat";
import {
  UserChatListResponse,
  ChatHistoryWithOnlineStatusResponse,
} from "@/src/lib/generated-api";

export interface ChatHistoryResponse {
  messages: ChatMessage[];
  peerOnline: boolean;
}

export interface ChatApiService {
  getChatHistory(chatId: string): Promise<ChatHistoryResponse>;
  getUserChats(userId: string): Promise<ChatListItem[]>;
  markChatAsRead(chatId: string, userId: string): Promise<void>;
  getChatId(itemId: string, userId: string): Promise<string>;
  getUnreadCount(chatId: string, userId: string): Promise<number>;
}

class ChatApiServiceImpl implements ChatApiService {
  constructor(private getAccessToken: () => string | null) {}

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = this.getAccessToken();
    if (!token) {
      throw new Error("No access token available");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${response.statusText}`
      );
    }

    return response;
  }

  async getChatHistory(chatId: string): Promise<ChatHistoryResponse> {
    const response = await this.fetchWithAuth(`/api/chat/${chatId}/history`);
    const data: ChatHistoryWithOnlineStatusResponse = await response.json();
    return {
      messages: data.messages || [],
      peerOnline: data.peerOnline || false,
    };
  }

  async getUserChats(userId: string): Promise<ChatListItem[]> {
    const response = await this.fetchWithAuth(`/api/chat/user/${userId}`);
    return response.json();
  }

  async markChatAsRead(chatId: string, userId: string): Promise<void> {
    await this.fetchWithAuth(`/api/chat/${chatId}/mark-as-read/${userId}`, {
      method: "PUT",
    });
  }

  async getChatId(itemId: string, userId: string): Promise<string> {
    const response = await this.fetchWithAuth(
      `/api/chat/item/${itemId}/user/${userId}`
    );
    return response.json();
  }

  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    const response = await this.fetchWithAuth(
      `/api/chat/${chatId}/unread-count/${userId}`
    );
    return response.json();
  }
}

export const createChatApiService = (
  getAccessToken: () => string | null
): ChatApiService => {
  return new ChatApiServiceImpl(getAccessToken);
};
