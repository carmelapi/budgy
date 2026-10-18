import AmountField from "../components/AmountField";
import { amountForSave, evaluateAmount } from "../utils/amount";
import { useBudget } from "../context/BudgetContext";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { api } from "../utils/api";
import { useTranslation } from "../hooks/useTranslation";
import type { MonthlyIncome } from "../types/incomes-outcomes.types";

function getMonthOptions() {
  const months = [];
  const today = new Date();
  for (let i = -3; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
    months.push({ value, label });
  }
  return months;
}

const IncomesPage: React.FC = () => {
  const { t } = useTranslation();
  const { budgetVersion } = useBudget();

  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingIncome, setEditingIncome] = useState<MonthlyIncome | null>(
    null,
  );
  const [editForm, setEditForm] = useState({
    month: "",
    salary: "",
    extra: "",
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchIncomes = async () => {
    try {
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
  }, [budgetVersion]);

  const formatCurrency = (amount: string): string => {
    const num = parseFloat(amount);
    return `${num.toLocaleString("sv-SE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split("-");
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

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
      setEditError(t.incomes.errors.monthRequired);
      return;
    }
    if (editForm.salary === "" || !(evaluateAmount(editForm.salary) >= 0)) {
      setEditError(t.incomes.errors.salaryMin);
      return;
    }
    if (editForm.extra === "" || !(evaluateAmount(editForm.extra) >= 0)) {
      setEditError(t.incomes.errors.extraMin);
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);

      await api.put(`/api/incomes/${editingIncome.id}`, {
        month: editForm.month,
        salary: amountForSave(editForm.salary, t.amount.invalid),
        extra: amountForSave(editForm.extra, t.amount.invalid),
      });

      const response = await api.get("/api/incomes");
      setIncomes(response.incomes);

      handleCloseEdit();
    } catch (err) {
      console.error("Error updating income:", err);
      setEditError(
        err instanceof Error ? err.message : "Failed to update income",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-content">
        <h1 className="text-2xl font-bold text-gray-800">{t.incomes.title}</h1>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <CircularProgress />
            <span className="ml-3 text-gray-600">{t.incomes.loading}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>{t.errors.errorPrefix}:</strong> {error}
          </div>
        )}

        {!loading && !error && (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: 600, fontSize: "13px" }}>
                    {t.incomes.table.month}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "13px" }}
                    align="right"
                  >
                    {t.incomes.table.salary}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "13px" }}
                    align="right"
                  >
                    {t.incomes.table.extra}
                  </TableCell>
                  <TableCell
                    sx={{ fontWeight: 600, fontSize: "13px" }}
                    align="right"
                  >
                    {t.incomes.table.total}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {incomes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      align="center"
                      sx={{ py: 6, color: "#9ca3af" }}
                    >
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-lg">{t.incomes.empty.title}</span>
                        <span className="text-sm">
                          {t.incomes.empty.subtitle}
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
                        "&:hover": { backgroundColor: "#f5f7fc" },
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

      <Dialog
        open={!!editingIncome}
        onClose={handleCloseEdit}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>{t.incomes.dialog.editTitle}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <FormControl fullWidth>
              <InputLabel>{t.incomes.dialog.month}</InputLabel>
              <Select
                value={editForm.month}
                label={t.incomes.dialog.month}
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

            <AmountField
              label={t.incomes.dialog.salary}
              value={editForm.salary}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, salary: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <AmountField
              label={t.incomes.dialog.extra}
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
            {t.incomes.dialog.cancel}
          </Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={editSubmitting}
          >
            {editSubmitting ? t.incomes.dialog.saving : t.incomes.dialog.save}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IncomesPage;
