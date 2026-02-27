import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/Logo.svg";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import {
  DialogContent,
  DialogTitle,
  DialogActions,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import { useTranslation } from "../hooks/useTranslation";

/** Generates month options for ±3 months from today (e.g. "Jan 2026") */
function getMonthOptions() {
  const months = [];
  const today = new Date();
  for (let i = -3; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    // value is stored as "2026-02" — what the backend expects
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    months.push({ value, label });
  }
  return months;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const { user, logout, updateSettings } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  // ── Add dialog state ──────────────────────────────────────────────────────
  // Pre-compute current month in "2026-02" format so forms default to it
  const today = new Date();
  const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  // Controls which step of the dialog we're on
  const [addStep, setAddStep] = useState<"choose" | "income" | "outcome" | "balance">("choose");

  // Income form fields — month defaults to current month
  const [incomeForm, setIncomeForm] = useState({ month: currentMonth, salary: "", extra: "" });

  // Outcome form fields — month defaults to current month
  const [outcomeForm, setOutcomeForm] = useState({ month: currentMonth, avgift_loan: "", debt: "", extra: "" });

  // Bank balance form fields
  const [balanceForm, setBalanceForm] = useState({ month: currentMonth, amount: "" });

  const [addError, setAddError] = useState<string | null>(null);
  const [addSubmitting, setAddSubmitting] = useState(false);
  // ─────────────────────────────────────────────────────────────────────────

  const handleClickOpen = () => {
    setOpen(true);
  };

  /** Closes the Add dialog and resets all form state back to initial values */
  const handleClose = () => {
    setOpen(false);
    // Reset so next open starts fresh at the "choose" step
    setAddStep("choose");
    setIncomeForm({ month: currentMonth, salary: "", extra: "" });
    setOutcomeForm({ month: currentMonth, avgift_loan: "", debt: "", extra: "" });
    setBalanceForm({ month: currentMonth, amount: "" });
    setAddError(null);
    setAddSubmitting(false);
  };

  /** Submits the income or outcome form to the backend */
  const handleAddSubmit = async () => {
    setAddError(null);
    setAddSubmitting(true);
    try {
      if (addStep === "income") {
        // POST to /api/incomes — backend expects { month, salary, extra }
        await api.post("/api/incomes", {
          month: incomeForm.month,
          salary: Number(incomeForm.salary),
          extra: Number(incomeForm.extra),
        });
      } else if (addStep === "outcome") {
        // POST to /api/monthly-outcomes — backend expects { month, avgift_loan, debt, extra }
        await api.post("/api/monthly-outcomes", {
          month: outcomeForm.month,
          avgift_loan: Number(outcomeForm.avgift_loan),
          debt: Number(outcomeForm.debt),
          extra: Number(outcomeForm.extra),
        });
      } else if (addStep === "balance") {
        await api.post("/api/account-balances", {
          month: balanceForm.month,
          amount: Number(balanceForm.amount),
        });
      }
      handleClose();
      // Refresh the current page so the new row appears in the table
      navigate(0);
    } catch (err: any) {
      setAddError(err.message || t.navbar.addDialog.somethingWentWrong);
    } finally {
      setAddSubmitting(false);
    }
  };

  /**
   * Handle logout button click
   * Clears authentication and redirects to login page
   */
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleOpenSettings = () => {
    setSelectedCurrency(user?.base_currency || "SEK");
    setSelectedLanguage(user?.language || "EN");
    setSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setSettingsOpen(false);
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await updateSettings(selectedCurrency, selectedLanguage);
      setSettingsOpen(false);
    } catch (err) {
      console.error("Failed to update settings:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white flex flex-row w-full h-[60px] justify-between py-4 px-6 items-center">
      <img src={logo} alt="Budgy brand" height="36px" />

      <div className="flex flex-row gap-4 items-center">
        {user && (
          <button
            onClick={handleOpenSettings}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors cursor-pointer"
          >
            {t.navbar.welcome}, <span className="font-medium">{user.email}</span>
          </button>
        )}

        {/* Add button */}
        <Button variant="outlined" onClick={handleClickOpen}>
          {t.navbar.add}
        </Button>

        {/* Logout button */}
        <Button variant="outlined" color="error" onClick={handleLogout}>
          {t.navbar.logout}
        </Button>
      </div>

      {/* ── Add Income / Outcome Dialog ─────────────────────────────────────── */}
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>

        {/* ── Step 1: Choose type ─────────────────────────────────── */}
        {addStep === "choose" && (
          <>
            <DialogTitle>{t.navbar.addDialog.chooseTitle}</DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-3 mt-2">
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setAddStep("income")}
                >
                  {t.navbar.addDialog.income}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setAddStep("outcome")}
                >
                  {t.navbar.addDialog.outcome}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setAddStep("balance")}
                >
                  {t.navbar.addDialog.bankBalance}
                </Button>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>{t.navbar.addDialog.cancel}</Button>
            </DialogActions>
          </>
        )}

        {/* ── Step 2a: Income form ────────────────────────────────── */}
        {addStep === "income" && (
          <>
            <DialogTitle>{t.navbar.addDialog.addIncomeTitle}</DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-4 mt-2">
                {/* Month picker */}
                <FormControl fullWidth>
                  <FormLabel>{t.navbar.addDialog.month}</FormLabel>
                  <Select
                    value={incomeForm.month}
                    onChange={(e) => setIncomeForm({ ...incomeForm, month: e.target.value })}
                    disabled={addSubmitting}
                  >
                    {getMonthOptions().map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t.navbar.addDialog.salary}
                  type="number"
                  fullWidth
                  value={incomeForm.salary}
                  onChange={(e) => setIncomeForm({ ...incomeForm, salary: e.target.value })}
                  disabled={addSubmitting}
                />

                <TextField
                  label={t.navbar.addDialog.extra}
                  type="number"
                  fullWidth
                  value={incomeForm.extra}
                  onChange={(e) => setIncomeForm({ ...incomeForm, extra: e.target.value })}
                  disabled={addSubmitting}
                />

                {/* Show backend error if any */}
                {addError && <p className="text-red-500 text-sm">{addError}</p>}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddStep("choose")} disabled={addSubmitting}>{t.navbar.addDialog.back}</Button>
              <Button
                onClick={handleAddSubmit}
                variant="contained"
                disabled={addSubmitting || !incomeForm.month}
              >
                {addSubmitting ? t.navbar.settings.saving : t.navbar.settings.save}
              </Button>
            </DialogActions>
          </>
        )}

        {/* ── Step 2b: Outcome form ───────────────────────────────── */}
        {addStep === "outcome" && (
          <>
            <DialogTitle>{t.navbar.addDialog.addOutcomeTitle}</DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-4 mt-2">
                {/* Month picker */}
                <FormControl fullWidth>
                  <FormLabel>{t.navbar.addDialog.month}</FormLabel>
                  <Select
                    value={outcomeForm.month}
                    onChange={(e) => setOutcomeForm({ ...outcomeForm, month: e.target.value })}
                    disabled={addSubmitting}
                  >
                    {getMonthOptions().map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t.navbar.addDialog.loanAvgift}
                  type="number"
                  fullWidth
                  value={outcomeForm.avgift_loan}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, avgift_loan: e.target.value })}
                  disabled={addSubmitting}
                />

                <TextField
                  label={t.navbar.addDialog.debt}
                  type="number"
                  fullWidth
                  value={outcomeForm.debt}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, debt: e.target.value })}
                  disabled={addSubmitting}
                />

                <TextField
                  label={t.navbar.addDialog.extra}
                  type="number"
                  fullWidth
                  value={outcomeForm.extra}
                  onChange={(e) => setOutcomeForm({ ...outcomeForm, extra: e.target.value })}
                  disabled={addSubmitting}
                />

                {addError && <p className="text-red-500 text-sm">{addError}</p>}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddStep("choose")} disabled={addSubmitting}>{t.navbar.addDialog.back}</Button>
              <Button
                onClick={handleAddSubmit}
                variant="contained"
                disabled={addSubmitting || !outcomeForm.month}
              >
                {addSubmitting ? t.navbar.settings.saving : t.navbar.settings.save}
              </Button>
            </DialogActions>
          </>
        )}

        {/* ── Step 2c: Bank Account Balance form ─────────────────── */}
        {addStep === "balance" && (
          <>
            <DialogTitle>{t.navbar.addDialog.addBankBalanceTitle}</DialogTitle>
            <DialogContent>
              <div className="flex flex-col gap-4 mt-2">
                <FormControl fullWidth>
                  <FormLabel>{t.navbar.addDialog.month}</FormLabel>
                  <Select
                    value={balanceForm.month}
                    onChange={(e) => setBalanceForm({ ...balanceForm, month: e.target.value })}
                    disabled={addSubmitting}
                  >
                    {getMonthOptions().map((m) => (
                      <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  label={t.navbar.addDialog.amountOnAccount}
                  type="number"
                  fullWidth
                  value={balanceForm.amount}
                  onChange={(e) => setBalanceForm({ ...balanceForm, amount: e.target.value })}
                  disabled={addSubmitting}
                  inputProps={{ min: 0, step: 0.01 }}
                />

                {addError && <p className="text-red-500 text-sm">{addError}</p>}
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setAddStep("choose")} disabled={addSubmitting}>{t.navbar.addDialog.back}</Button>
              <Button
                onClick={handleAddSubmit}
                variant="contained"
                disabled={addSubmitting || !balanceForm.month || !balanceForm.amount}
              >
                {addSubmitting ? t.navbar.settings.saving : t.navbar.settings.save}
              </Button>
            </DialogActions>
          </>
        )}

      </Dialog>
      {/* ─────────────────────────────────────────────────────────────────────── */}

      <Dialog open={settingsOpen} onClose={handleCloseSettings} maxWidth="sm" fullWidth>
        <DialogTitle>{t.navbar.settings.title}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <FormControl fullWidth>
              <FormLabel>{t.navbar.settings.language}</FormLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                disabled={saving}
              >
                <MenuItem value="EN">{t.languages.EN}</MenuItem>
                <MenuItem value="IT">{t.languages.IT}</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <FormLabel>{t.navbar.settings.currency}</FormLabel>
              <Select
                value={selectedCurrency}
                onChange={(e) => setSelectedCurrency(e.target.value)}
                disabled={saving}
              >
                <MenuItem value="SEK">{t.currencies.SEK}</MenuItem>
                <MenuItem value="EUR">{t.currencies.EUR}</MenuItem>
              </Select>
            </FormControl>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSettings} disabled={saving}>
            {t.navbar.settings.cancel}
          </Button>
          <Button onClick={handleSaveSettings} variant="contained" disabled={saving}>
            {saving ? t.navbar.settings.saving : t.navbar.settings.save}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
