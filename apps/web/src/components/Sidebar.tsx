import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "../hooks/useTranslation";

export default function Sidebar() {
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path: string): boolean => {
    return location.pathname === path;
  };

  return (
    <div className="bg-gray-100 flex flex-col w-1/6 p-4 gap-2">
      <Link
        to="/dashboard"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/dashboard")
            ? "bg-blue-600 text-white font-semibold"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {t.sidebar.dashboard}
      </Link>

      <Link
        to="/incomes"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/incomes")
            ? "bg-blue-600 text-white font-semibold"
            : " text-gray-700 hover:bg-gray-200"
        }`}
      >
        {t.sidebar.incomes}
      </Link>

      <Link
        to="/outcomes"
        className={`px-4 py-3 rounded-lg transition-colors ${
          isActive("/outcomes")
            ? "bg-blue-600 text-white font-semibold"
            : "text-gray-700 hover:bg-gray-200"
        }`}
      >
        {t.sidebar.outcomes}
      </Link>
    </div>
  );
}
