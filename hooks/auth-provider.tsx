"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import apiClient, {
  UserLoginDto,
  UserRegistrationDto,
  UserResponseDto,
} from "../lib/api-client";

interface AuthContextType {
  user: UserResponseDto | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  login: (credentials: UserLoginDto) => Promise<void>;
  register: (userData: UserRegistrationDto) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Check if user is already logged in by verifying token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("auth_token");

        if (token) {
          apiClient.loadTokenFromStorage();
          // Here you would typically verify the token with your backend
          // For now we'll just set as authenticated if token exists

          // You could also fetch the current user profile here
          // const userData = await apiClient.getCurrentUser();
          // setUser(userData);
          setUser({
            id: 1,
            fullName: "User",
            username: "user",
            email: "user@example.com",
            address: "",
            birthDate: "",
            active: true,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Authentication failed")
        );
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: UserLoginDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiClient.loginUser(credentials);

      // Assuming the backend returns user data along with the token
      if (result.user) {
        setUser(result.user);
      } else {
        // If not, fetch the user data separately
        const userData = await apiClient.getUserByUsername(
          credentials.username
        );
        setUser(userData);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Login failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: UserRegistrationDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await apiClient.registerUser(userData);
      // After registration, you may or may not want to automatically log in
      // If auto-login, you would set the user here
      // setUser(result);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Registration failed"));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    apiClient.clearToken();
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
