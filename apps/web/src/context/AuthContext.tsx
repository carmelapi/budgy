import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  type User,
  type AuthContextType,
  type AuthResponse,
} from "../types/auth.types";

/**
 * AuthContext - Global authentication state management
 *
 * Provides:
 * - User authentication state (user, token, isAuthenticated)
 * - Login/signup/logout functions
 * - Automatic token restoration from localStorage on app load
 */

// Create context with undefined default (will be provided by AuthProvider)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Start as loading to check localStorage
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  /**
   * On app load: Check if token exists in localStorage
   * If found, restore authentication state
   */
  useEffect(() => {
    const checkAuth = () => {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Failed to parse stored user data:", error);
          // Clear invalid data
          localStorage.removeItem("authToken");
          localStorage.removeItem("authUser");
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Login function
   * Calls /api/login endpoint and stores token in localStorage
   */
  const login = async (email: string, password: string): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      const authData: AuthResponse = data;

      // Store token and user in localStorage
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("authUser", JSON.stringify(authData.user));

      // Update state
      setToken(authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed";
      setError(errorMessage);
      console.error("Login error:", errorMessage);
      throw err; // Re-throw so LoginPage can handle it
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Signup function
   * Calls /api/signup endpoint and stores token in localStorage
   */
  const signup = async (
    email: string,
    password: string,
    base_currency: string = "SEK",
    language: string = "EN",
  ): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, base_currency, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      const authData: AuthResponse = data;

      // Store token and user in localStorage
      localStorage.setItem("authToken", authData.token);
      localStorage.setItem("authUser", JSON.stringify(authData.user));

      // Update state
      setToken(authData.token);
      setUser(authData.user);
      setIsAuthenticated(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Signup failed";
      setError(errorMessage);
      console.error("Signup error:", errorMessage);
      throw err; // Re-throw so LoginPage can handle it
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Logout function
   * Clears token from localStorage and resets state
   */
  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");

    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const updateSettings = async (
    base_currency?: string,
    language?: string,
  ): Promise<void> => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ base_currency, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      const updatedUser = data.user;

      localStorage.setItem("authUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update settings";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    signup,
    logout,
    updateSettings,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access AuthContext
 * Usage: const { user, login, logout } = useAuth();
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
