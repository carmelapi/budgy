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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { api } from "../utils/api";
import type { MonthlyIncome } from "../types/incomes-outcomes.types";

// Generates months from 3 months ago to 6 months ahead for the Select dropdown
function getMonthOptions() {
  const months = [];
  const today = new Date();
  for (let i = -3; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    months.push({ value, label });
  }
  return months;
}

const IncomesPage: React.FC = () => {
  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state — null means no row is selected (dialog closed)
  const [editingIncome, setEditingIncome] = useState<MonthlyIncome | null>(null);
  const [editForm, setEditForm] = useState({ month: "", salary: "", extra: "" });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Extracted so we can call it again after a successful edit
  const fetchIncomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/incomes");
      setIncomes(response.incomes);
    } catch (err) {
      console.error("Error fetching incomes:", err);
      setError(err instanceof Error ? err.message : "Failed to load incomes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncomes();
  }, []);

  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return `${num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  // Opens the edit dialog pre-filled with the clicked row's data
  const handleRowClick = (income: MonthlyIncome) => {
    setEditingIncome(income);
    setEditForm({
      month: income.month,
      salary: income.salary,
      extra: income.extra,
    });
    setEditError(null);
  };

  const handleCloseEdit = () => {
    setEditingIncome(null);
    setEditForm({ month: "", salary: "", extra: "" });
    setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editingIncome) return;

    if (!editForm.month) {
      setEditError("Month is required");
      return;
    }
    if (editForm.salary === "" || parseFloat(editForm.salary) < 0) {
      setEditError("Salary must be 0 or greater");
      return;
    }
    if (editForm.extra === "" || parseFloat(editForm.extra) < 0) {
      setEditError("Extra must be 0 or greater");
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);

      await api.put(`/api/incomes/${editingIncome.id}`, {
        month: editForm.month,
        salary: parseFloat(editForm.salary),
        extra: parseFloat(editForm.extra),
      });

      // Re-fetch so the table shows fresh data without a full page reload
      const response = await api.get("/api/incomes");
      setIncomes(response.incomes);

      handleCloseEdit();
    } catch (err) {
      console.error("Error updating income:", err);
      setEditError(err instanceof Error ? err.message : "Failed to update income");
    } finally {
      setEditSubmitting(false);
    }
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
                    <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">
                      Salary (kr)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">
                      Extra (kr)
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, fontSize: "16px" }} align="right">
                      Total (kr)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {incomes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 6, color: "#9ca3af" }}>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-lg">No income data yet</span>
                          <span className="text-sm">
                            Start by adding your first monthly income
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    incomes.map((income) => (
                      <TableRow
                        key={income.id}
                        onClick={() => handleRowClick(income)}
                        sx={{
                          cursor: "pointer",
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
                          sx={{ fontSize: "15px", fontWeight: 600, color: "#059669" }}
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

      {/* Edit Income Dialog */}
      <Dialog open={!!editingIncome} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Income</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <FormControl fullWidth>
              <InputLabel>Month</InputLabel>
              <Select
                value={editForm.month}
                label="Month"
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, month: e.target.value }))
                }
              >
                {getMonthOptions().map((opt) => (
                  <MenuItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Salary (kr)"
              type="number"
              value={editForm.salary}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, salary: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Extra (kr)"
              type="number"
              value={editForm.extra}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, extra: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            {editError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                {editError}
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit} disabled={editSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={editSubmitting}>
            {editSubmitting ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IncomesPage;
