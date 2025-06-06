import {
  ChatMessageResponse,
  UserChatListResponse,
  MinimalUserResponse,
} from "@/src/lib/generated-api";

export type ChatMessage = ChatMessageResponse;

export interface WebSocketMessage {
  id: string;
  chatId?: string;
  itemId: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  content: string;
  type: "CHAT" | "JOIN" | "LEAVE";
  timestamp: string;
}

export type MessageType = ChatMessageResponse.type;
export type ChatListItem = UserChatListResponse;

export interface Chat {
  id: string;
  itemId: string;
  itemTitle: string;
  participants: ChatParticipant[];
  lastMessage: string | null;
  lastActivity: string;
  unreadCount: number;
}

export interface ChatParticipant {
  userId: string;
  userName: string;
  userAvatar?: string;
  role: "buyer" | "seller";
}

export type ConnectionStatus =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface ChatWindowState {
  selectedChatId: string | null;
  messageInput: string;
  isTyping: boolean;
}

export interface ChatContextState {
  chats: ChatListItem[];
  notifications: ChatNotification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface ChatNotification {
  id: string;
  itemId: string;
  fromUserId: string;
  fromUserName: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}
