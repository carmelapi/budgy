import { Link, useLocation } from "react-router-dom";

/**
 * Sidebar Component
 *
 * Navigation menu for the app
 * Shows active state for current route
 */
export default function Sidebar() {
  // useLocation hook gives us the current URL path
  // Example: if we're at "/incomes", pathname = "/incomes"
  const location = useLocation();

  // Helper function to check if a link is active
  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-100 flex flex-col w-1/6 p-4 gap-2">
      {/* Dashboard Link */}
      <Link
        to="/dashboard"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/dashboard")
            ? "bg-blue-600 text-white font-semibold"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        Dashboard
      </Link>

      {/* Incomes Link */}
      <Link
        to="/incomes"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/incomes")
            ? "bg-blue-600 text-white font-semibold"
            : " text-gray-700 hover:bg-gray-200"
        }`}
      >
        Incomes
      </Link>

      {/* Outcomes Link */}
      <Link
        to="/outcomes"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/outcomes")
            ? "bg-blue-600 text-white font-semibold"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        Outcomes
      </Link>
    </div>
  );
}
