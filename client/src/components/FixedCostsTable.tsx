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
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { api } from "../utils/api";
import {
  fetchExchangeRates,
  formatCurrencyWithConversion,
  convertCurrency,
} from "../utils/currency";
import { useBudget } from "../context/BudgetContext";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "../hooks/useTranslation";
import type { FixedCost } from "../types/incomes-outcomes.types";

const FixedCostsTable: React.FC = () => {
  const { setFixedCostsTotal } = useBudget();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number } | null>(null);

  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    currency: "SEK" as "SEK" | "EUR",
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [costsResponse, rates] = await Promise.all([
          api.get("/api/fixed-costs"),
          fetchExchangeRates(),
        ]);

        setFixedCosts(costsResponse.fixedCosts);
        setExchangeRates(rates);
      } catch (err) {
        console.error("Error fetching fixed costs:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load fixed costs",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateGrandTotal = (): number => {
    if (!exchangeRates || !user?.base_currency) return 0;

    return fixedCosts.reduce((sum, cost) => {
      const amount = parseFloat(cost.amount);
      const convertedAmount = convertCurrency(
        amount,
        cost.currency,
        user.base_currency!,
        exchangeRates
      );
      return sum + convertedAmount;
    }, 0);
  };

  const grandTotal = calculateGrandTotal();

  useEffect(() => {
    setFixedCostsTotal(grandTotal);
  }, [grandTotal, setFixedCostsTotal]);

  const handleOpenDialog = () => {
    setDialogOpen(true);
    setFormData({ description: "", amount: "", currency: "SEK" });
    setFormError(null);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFormData({ description: "", amount: "", currency: "SEK" });
    setFormError(null);
  };

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormError(null);
  };

  const handleSubmit = async () => {
    const { description, amount, currency } = formData;

    if (!description.trim()) {
      setFormError("Description is required");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setFormError("Amount must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);
      setFormError(null);

      await api.post("/api/fixed-costs", {
        description: description.trim(),
        amount: parseFloat(amount),
        currency,
      });

      const response = await api.get("/api/fixed-costs");
      setFixedCosts(response.fixedCosts);

      handleCloseDialog();
    } catch (err) {
      console.error("Error creating fixed cost:", err);
      setFormError(err instanceof Error ? err.message : "Failed to create fixed cost");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">
        {t.outcomes.fixedCosts.title}
      </h2>

      {loading && (
        <div className="flex justify-center items-center py-8 bg-gray-100 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">
            {t.outcomes.fixedCosts.loading}
          </span>
        </div>
      )}

      {/* Error state */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Table */}
      {!loading && !error && (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f3f4f6" }}>
                <TableCell sx={{ fontWeight: 600, fontSize: "16px" }}>
                  {t.outcomes.fixedCosts.table.description}
                </TableCell>
                <TableCell
                  sx={{ fontWeight: 600, fontSize: "16px" }}
                  align="right"
                >
                  {t.outcomes.fixedCosts.table.amount}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedCosts.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={2}
                    align="center"
                    sx={{ py: 6, color: "#9ca3af" }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">{t.outcomes.fixedCosts.empty.title}</span>
                      <span className="text-sm">
                        {t.outcomes.fixedCosts.empty.subtitle}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Map through fixed costs */}
                  {fixedCosts.map((cost) => (
                    <TableRow
                      key={cost.id}
                      sx={{
                        "&:hover": { backgroundColor: "#f9fafb" },
                        transition: "background-color 0.2s",
                      }}
                    >
                      <TableCell sx={{ fontSize: "15px" }}>
                        {cost.description}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: "15px" }}>
                        {exchangeRates && user?.base_currency
                          ? formatCurrencyWithConversion(
                              parseFloat(cost.amount),
                              cost.currency,
                              user.base_currency,
                              exchangeRates
                            )
                          : `${cost.amount} ${cost.currency}`}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Grand Total Footer Row */}
                  <TableRow sx={{ backgroundColor: "#e5e7eb" }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: "16px" }}>
                      {t.outcomes.fixedCosts.grandTotal}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "#1f2937",
                      }}
                    >
                      {grandTotal.toLocaleString("sv-SE", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{" "}
                      {user?.base_currency === "EUR" ? "EUR" : "kr"}
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {!loading && !error && (
        <div className="mt-3">
          <Button variant="outlined" size="small" onClick={handleOpenDialog}>
            {t.outcomes.fixedCosts.addButton}
          </Button>
        </div>
      )}

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t.outcomes.fixedCosts.dialog.title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label={t.outcomes.fixedCosts.dialog.description}
              placeholder={t.outcomes.fixedCosts.dialog.descriptionPlaceholder}
              value={formData.description}
              onChange={(e) => handleFormChange("description", e.target.value)}
              fullWidth
              autoFocus
            />

            <TextField
              label={t.outcomes.fixedCosts.dialog.amount}
              type="number"
              placeholder={t.outcomes.fixedCosts.dialog.amountPlaceholder}
              value={formData.amount}
              onChange={(e) => handleFormChange("amount", e.target.value)}
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <FormControl fullWidth>
              <InputLabel>{t.outcomes.fixedCosts.dialog.currency}</InputLabel>
              <Select
                value={formData.currency}
                label="Currency"
                onChange={(e) => handleFormChange("currency", e.target.value)}
              >
                <MenuItem value="SEK">{t.currencies.SEK}</MenuItem>
                <MenuItem value="EUR">{t.currencies.EUR}</MenuItem>
              </Select>
            </FormControl>

            {formError && (
              <div className="bg-red-50 border border-red-200 rounded p-3 text-red-700 text-sm">
                {formError}
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} disabled={submitting}>
            {t.outcomes.fixedCosts.dialog.cancel}
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={submitting}
          >
            {submitting ? t.outcomes.fixedCosts.dialog.saving : t.outcomes.fixedCosts.dialog.save}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FixedCostsTable;
