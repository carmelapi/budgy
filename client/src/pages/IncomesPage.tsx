import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { api } from "../utils/api";
import type { MonthlyIncome } from "../types/incomes-outcomes.types";

const IncomesPage: React.FC = () => {
  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        setLoading(true);
        setError(null);

        // Call backend API: GET /api/incomes
        // This returns: { incomes: [...] }
        const response = await api.get("/api/incomes");

        setIncomes(response.incomes);
      } catch (err) {
        console.error("Error fetching incomes:", err);
        setError(err instanceof Error ? err.message : "Failed to load incomes");
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, []);

  /**
   * Helper: Format currency
   * Converts "35000.00" string to "35,000.00 kr"
   */
  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return `${num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  /**
   * Helper: Format month
   * Converts "2026-02" to "Feb 2026"
   */
  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-row w-full h-[calc(100vh-60px)]">
        <Sidebar />
        <div className="flex flex-col gap-4 p-6 w-full overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800">Monthly Incomes</h1>
          {loading && (
            <div className="flex justify-center items-center py-8">
              <CircularProgress />
              <span className="ml-3 text-gray-600">Loading incomes...</span>
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <strong>Error:</strong> {error}
            </div>
          )}

          {!loading && !error && (
            <TableContainer component={Paper} className="shadow-md">
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                    <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
                      Month
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, fontSize: "16px" }}
                      align="right"
                    >
                      Salary (kr)
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, fontSize: "16px" }}
                      align="right"
                    >
                      Extra (kr)
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: 600, fontSize: "16px" }}
                      align="right"
                    >
                      Total (kr)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomes.length === 0 ? (
                    // Empty state - no income data yet
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        align="center"
                        sx={{ py: 6, color: "#9ca3af" }}
                      >
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg">No income data yet</span>
                          <span className="text-sm">
                            Start by adding your first monthly income
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Map through incomes array and create a row for each income
                    // Why key={income.id}? React needs unique IDs to efficiently update the list
                    incomes.map((income) => (
                      <TableRow
                        key={income.id}
                        sx={{
                          "&:hover": { backgroundColor: "#f9fafb" },
                          transition: "background-color 0.2s",
                        }}
                      >
                        <TableCell sx={{ fontSize: "15px" }}>
                          {formatMonth(income.month)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: "15px" }}>
                          {formatCurrency(income.salary)}
                        </TableCell>
                        <TableCell align="right" sx={{ fontSize: "15px" }}>
                          {formatCurrency(income.extra)}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#059669",
                          }}
                        >
                          {formatCurrency(income.total)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </div>
      </div>
    </>
  );
};

export default IncomesPage;
