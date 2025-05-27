import { ChatNotification } from "../types/chat";

export interface NotificationApiService {
  getNotifications(userId: string): Promise<ChatNotification[]>;
}

class NotificationApiServiceImpl implements NotificationApiService {
  constructor(private getAccessToken: () => string | null) {}

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      throw new Error("Access token required");
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async getNotifications(userId: string): Promise<ChatNotification[]> {
    return this.makeRequest(`/api/notifications/user/${userId}`);
  }
}

export const createNotificationApiService = (
  getAccessToken: () => string | null
): NotificationApiService => {
  return new NotificationApiServiceImpl(getAccessToken);
};
