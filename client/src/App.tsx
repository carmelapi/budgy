import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import IncomesPage from "./pages/IncomesPage";
import OutcomesPage from "./pages/OutcomesPage";
import PrivateRoute from "./components/PrivateRoute";
import { BudgetProvider } from "./context/BudgetContext";

export default function App() {
  return (
    <BudgetProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/incomes"
          element={
            <PrivateRoute>
              <IncomesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/outcomes"
          element={
            <PrivateRoute>
              <OutcomesPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </BudgetProvider>
  );
}
