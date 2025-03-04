import { useState, useEffect } from "react";
import apiClient, {
  UserRegistrationDto,
  UserLoginDto,
  ItemRequest,
  ItemResponse,
  CategoryDTO,
  PaginatedResponse,
} from "../lib/api-client";

// AUTH HOOKS
export const useAuth = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("auth_token");

        if (token) {
          // You might want to validate the token on the server
          // For now, we'll just set the user as logged in
          setUser({ loggedIn: true });
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: UserLoginDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.loginUser(credentials);
      setUser(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegistrationDto) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.registerUser(userData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Registration failed"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  return { user, loading, error, login, register, logout };
};

// CATEGORY HOOKS
export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.getAllCategories();
      setCategories(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch categories")
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const getRootCategories = async () => {
    try {
      setLoading(true);
      const result = await apiClient.getRootCategories();
      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch root categories")
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getSubcategories = async (parentId: number) => {
    try {
      setLoading(true);
      const result = await apiClient.getSubcategories(parentId);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to fetch subcategories")
      );
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    categories,
    loading,
    error,
    fetchCategories,
    getRootCategories,
    getSubcategories,
  };
};

// ITEM HOOKS
export const useItems = () => {
  const [items, setItems] = useState<PaginatedResponse<ItemResponse> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItems = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.getItems(page, size, sortBy, direction);
      setItems(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch items"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableItems = async (
    page: number = 0,
    size: number = 10,
    sortBy: string = "postedOn",
    direction: string = "desc"
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.getAvailableItems(
        page,
        size,
        sortBy,
        direction
      );
      setItems(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error
          ? err
          : new Error("Failed to fetch available items")
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  const searchItems = async (
    keyword: string,
    page: number = 0,
    size: number = 10
  ) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.searchItems(keyword, page, size);
      setItems(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to search items")
      );
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    items,
    loading,
    error,
    fetchItems,
    fetchAvailableItems,
    searchItems,
  };
};

// ITEM DETAIL HOOK
export const useItem = (id?: number) => {
  const [item, setItem] = useState<ItemResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchItem = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.getItemById(itemId);
      setItem(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch item"));
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchItem(id);
    }
  }, [id]);

  const createItem = async (itemData: ItemRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.createItem(itemData);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to create item"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId: number, itemData: ItemRequest) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.updateItem(itemId, itemData);
      setItem(result);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to update item"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      await apiClient.deleteItem(itemId);
      setItem(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to delete item"));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markItemAsTaken = async (itemId: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiClient.markItemAsTaken(itemId);
      setItem(result);
      return result;
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Failed to mark item as taken")
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    item,
    loading,
    error,
    fetchItem,
    createItem,
    updateItem,
    deleteItem,
    markItemAsTaken,
  };
};
