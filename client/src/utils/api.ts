/**
 * API Helper - Centralized API request function
 *
 * Benefits:
 * 1. Automatically attaches JWT token to all requests
 * 2. Handles token expiration (auto-logout on 401)
 * 3. Consistent error handling
 * 4. No need to manually add Authorization header everywhere
 *
 * Usage:
 * const data = await apiRequest('/api/transactions', {
 *   method: 'POST',
 *   body: JSON.stringify({ amount: 100 })
 * });
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface ApiRequestOptions extends RequestInit {
  requiresAuth?: boolean; // Set to false for public endpoints (default: true)
}

export async function apiRequest(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<any> {
  const { requiresAuth = true, ...fetchOptions } = options;

  // Get token from localStorage
  const token = localStorage.getItem('authToken');

  // Build headers
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...fetchOptions.headers,
  };

  // Add Authorization header if token exists and auth is required
  if (requiresAuth && token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    // Handle 401 Unauthorized - token expired or invalid
    if (response.status === 401) {
      console.warn('Token expired or invalid. Logging out...');

      // Clear auth data
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');

      // Redirect to login
      window.location.href = '/';

      throw new Error('Session expired. Please login again.');
    }

    // Parse JSON response
    const data = await response.json();

    // If response is not ok, throw error with message from backend
    if (!response.ok) {
      throw new Error(data.error || data.message || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Helper functions for common HTTP methods
 */

export const api = {
  get: (endpoint: string, options?: ApiRequestOptions) =>
    apiRequest(endpoint, { ...options, method: 'GET' }),

  post: (endpoint: string, body: any, options?: ApiRequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    }),

  put: (endpoint: string, body: any, options?: ApiRequestOptions) =>
    apiRequest(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body),
    }),

  delete: (endpoint: string, options?: ApiRequestOptions) =>
    apiRequest(endpoint, { ...options, method: 'DELETE' }),
};

/**
 * Example usage:
 *
 * // GET request
 * const transactions = await api.get('/api/transactions');
 *
 * // POST request
 * const newTransaction = await api.post('/api/transactions', {
 *   amount: 100,
 *   description: 'Groceries'
 * });
 *
 * // Public endpoint (no auth required)
 * const data = await api.get('/api/public', { requiresAuth: false });
 */
