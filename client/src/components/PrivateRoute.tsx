import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

/**
 * PrivateRoute - Protects routes from unauthorized access
 *
 * How it works:
 * 1. Checks if user is authenticated using AuthContext
 * 2. If loading: shows loading message
 * 3. If not authenticated: redirects to login page (/)
 * 4. If authenticated: renders the protected component (children)
 *
 * Usage:
 * <Route path="/dashboard" element={
 *   <PrivateRoute>
 *     <Dashboard />
 *   </PrivateRoute>
 * } />
 */

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '1.2rem'
      }}>
        Loading...
      </div>
    );
  }

  // If not authenticated, redirect to login page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // User is authenticated, render the protected component
  return <>{children}</>;
};

export default PrivateRoute;
