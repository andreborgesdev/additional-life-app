import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Type definitions based on OpenAPI spec
export interface UserRegistrationDto {
  fullName: string;
  username: string;
  email: string;
  password: string;
  address: string;
  birthDate: string; // format: date
}

export interface UserResponseDto {
  id: number;
  fullName: string;
  username: string;
  email: string;
  address: string;
  birthDate: string; // format: date
  active: boolean;
}

export interface UserLoginDto {
  username: string;
  password: string;
}

export interface CategoryDTO {
  id: number;
  title: string;
  description: string;
  parentId?: number;
  parentTitle?: string;
  createdAt: string; // format: date-time
  active: boolean;
}

export interface ItemRequest {
  title: string;
  description: string;
  address?: string;
  imageUrl?: string;
  itemType: "INTERNAL" | "EXTERNAL";
  externalUrl?: string;
  originalPostedOn?: string; // format: date-time
  pickupInstructions?: string;
  conditionDescription?: string;
  userId: number;
  categoryId: number;
  sourcePlatformId?: number;
}

export interface UserSummaryDto {
  id: number;
  username: string;
  email: string;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface SourcePlatformDto {
  id: number;
  name: string;
}

export interface ItemResponse {
  id: number;
  title: string;
  description: string;
  address?: string;
  postedOn: string; // format: date-time
  updatedAt: string; // format: date-time
  imageUrl?: string;
  itemType: "INTERNAL" | "EXTERNAL";
  externalUrl?: string;
  originalPostedOn?: string; // format: date-time
  pickupInstructions?: string;
  conditionDescription?: string;
  active: boolean;
  user: UserSummaryDto;
  category: CategoryDto;
  sourcePlatform?: SourcePlatformDto;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
  };
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  empty: boolean;
}

class ApiClient {
  private axiosInstance: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: API_BASE_URL,
    });

    // Add a request interceptor to attach the token to each request
    this.axiosInstance.interceptors.request.use(
      (config) => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Add a response interceptor to handle errors
    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error("API request failed:", error);
        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem("auth_token", token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem("auth_token");
  }

  loadTokenFromStorage() {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (token) {
        this.token = token;
      }
    }
  }

  // User API
  async registerUser(userData: UserRegistrationDto): Promise<UserResponseDto> {
    const response = await this.axiosInstance.post(
      "/api/v1/users/register",
      userData
    );
    return response.data;
  }

  async loginUser(credentials: UserLoginDto): Promise<any> {
    const response = await this.axiosInstance.post(
      "/api/v1/users/login",
      credentials
    );

    // Assuming the login response contains a token
    if (response.data.token) {
      this.setToken(response.data.token);
    }

    return response.data;
  }

  async getUserByUsername(username: string): Promise<UserResponseDto> {
    const response = await this.axiosInstance.get(`/api/v1/users/${username}`);
    return response.data;
  }

  // Category API
  async getAllCategories(): Promise<CategoryDTO[]> {
    const response = await this.axiosInstance.get("/api/v1/categories");
    return response.data;
  }

  async getCategoryById(id: number): Promise<CategoryDTO> {
    const response = await this.axiosInstance.get(`/api/v1/categories/${id}`);
    return response.data;
  }

  async getRootCategories(): Promise<CategoryDTO[]> {
    const response = await this.axiosInstance.get("/api/v1/categories/root");
    return response.data;
  }

  async getSubcategories(parentId: number): Promise<CategoryDTO[]> {
    const response = await this.axiosInstance.get(
      `/api/v1/categories/${parentId}/subcategories`
    );
    return response.data;
  }

  // Item API
  async createItem(item: ItemRequest): Promise<ItemResponse> {
    const response = await this.axiosInstance.post("/api/v1/items", item);
    return response.data;
  }

  async updateItem(id: number, item: ItemRequest): Promise<ItemResponse> {
    const response = await this.axiosInstance.put(`/api/v1/items/${id}`, item);
    return response.data;
  }

  async deleteItem(id: number): Promise<void> {
    await this.axiosInstance.delete(`/api/v1/items/${id}`);
  }

  async getItemById(id: number): Promise<ItemResponse> {
    const response = await this.axiosInstance.get(`/api/v1/items/${id}`);
    return response.data;
  }

  async markItemAsTaken(id: number): Promise<ItemResponse> {
    const response = await this.axiosInstance.put(
      `/api/v1/items/${id}/mark-taken`
    );
    return response.data;
  }

  async getItems(
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get("/api/v1/items", {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

  async getAvailableItems(
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get("/api/v1/items/available", {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  }

  async searchItems(
    keyword: string,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get("/api/v1/items/search", {
      params: { keyword, page, size },
    });
    return response.data;
  }

  async getUserItems(userId: number): Promise<ItemResponse[]> {
    const response = await this.axiosInstance.get(
      `/api/v1/items/user/${userId}`
    );
    return response.data;
  }

  async getItemsByCategory(
    categoryId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get(
      `/api/v1/items/category/${categoryId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  }

  async getItemsByType(
    itemType: "INTERNAL" | "EXTERNAL",
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get(
      `/api/v1/items/type/${itemType}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  }

  async getItemsByPlatform(
    platformId: number,
    page: number = 0,
    size: number = 10
  ): Promise<PaginatedResponse<ItemResponse>> {
    const response = await this.axiosInstance.get(
      `/api/v1/items/platform/${platformId}`,
      {
        params: { page, size },
      }
    );
    return response.data;
  }
}

// Export a singleton instance
const apiClient = new ApiClient();
// Load token if available when in browser environment
if (typeof window !== "undefined") {
  apiClient.loadTokenFromStorage();
}

export default apiClient;
