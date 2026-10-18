import { Link, useLocation } from "react-router-dom";
import SpaceDashboardRounded from "@mui/icons-material/SpaceDashboardRounded";
import ArrowDownwardRounded from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import { useTranslation } from "../hooks/useTranslation";

export default function Sidebar() {
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const links = [
    { path: "/dashboard", label: t.sidebar.dashboard, Icon: SpaceDashboardRounded },
    { path: "/incomes", label: t.sidebar.incomes, Icon: ArrowDownwardRounded },
    { path: "/outcomes", label: t.sidebar.outcomes, Icon: ArrowUpwardRounded },
  ];

  return (
    <nav className="app-sidebar" aria-label="Budget">
      {links.map(({ path, label, Icon }) => (
        <Link
          key={path}
          to={path}
          aria-current={pathname === path ? "page" : undefined}
          className={`sidebar-link ${pathname === path ? "is-active" : ""}`}
        >
          <Icon fontSize="small" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}
