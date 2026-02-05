/**
 * TypeScript interfaces for authentication
 */

// User object returned from backend
export interface User {
  id: number;
  email: string;
}

// Response from login/signup endpoints
export interface AuthResponse {
  token: string;
  user: User;
}

// Authentication context interface
export interface AuthContextType {
  // State
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Methods
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
}
