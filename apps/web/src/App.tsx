import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LoginPage from "./pages/LoginPage";
import IncomesPage from "./pages/IncomesPage";
import OutcomesPage from "./pages/OutcomesPage";
import PrivateRoute from "./components/PrivateRoute";
import AppLayout from "./components/AppLayout";
import { BudgetProvider } from "./context/BudgetContext";

export default function App() {
  return (
    <BudgetProvider>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/incomes" element={<IncomesPage />} />
          <Route path="/outcomes" element={<OutcomesPage />} />
        </Route>
      </Routes>
    </BudgetProvider>
  );
}
