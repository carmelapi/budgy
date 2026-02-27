import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { api } from '../utils/api';
import { useBudget } from '../context/BudgetContext';
import { useTranslation } from '../hooks/useTranslation';
import type { MonthlyOutcome } from '../types/incomes-outcomes.types';

function getMonthOptions() {
  const months = [];
  const today = new Date();
  for (let i = -3; i <= 6; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() + i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    months.push({ value, label });
  }
  return months;
}

const MonthlyOutcomesTable: React.FC = () => {
  const { fixedCostsTotal } = useBudget();
  const { t } = useTranslation();

  const [outcomes, setOutcomes] = useState<MonthlyOutcome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [editingOutcome, setEditingOutcome] = useState<MonthlyOutcome | null>(null);
  const [editForm, setEditForm] = useState({ month: '', avgift_loan: '', debt: '', extra: '' });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const fetchOutcomes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/api/monthly-outcomes');
      setOutcomes(response.monthlyOutcomes);
    } catch (err) {
      console.error('Error fetching monthly outcomes:', err);
      setError(err instanceof Error ? err.message : 'Failed to load monthly outcomes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutcomes();
  }, []);

  const calculateRowTotal = (outcome: MonthlyOutcome): number => {
    const avgiftLoan = parseFloat(outcome.avgift_loan);
    const debt = parseFloat(outcome.debt);
    const extra = parseFloat(outcome.extra);
    return avgiftLoan + fixedCostsTotal + debt + extra;
  };

  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const handleRowClick = (outcome: MonthlyOutcome) => {
    setEditingOutcome(outcome);
    setEditForm({
      month: outcome.month,
      avgift_loan: outcome.avgift_loan,
      debt: outcome.debt,
      extra: outcome.extra,
    });
    setEditError(null);
  };

  const handleCloseEdit = () => {
    setEditingOutcome(null);
    setEditForm({ month: '', avgift_loan: '', debt: '', extra: '' });
    setEditError(null);
  };

  const handleEditSubmit = async () => {
    if (!editingOutcome) return;

    if (!editForm.month) {
      setEditError(t.outcomes.monthlyOutcomes.errors.monthRequired);
      return;
    }
    if (editForm.avgift_loan === '' || parseFloat(editForm.avgift_loan) < 0) {
      setEditError(t.outcomes.monthlyOutcomes.errors.avgiftLoanMin);
      return;
    }
    if (editForm.debt === '' || parseFloat(editForm.debt) < 0) {
      setEditError(t.outcomes.monthlyOutcomes.errors.debtMin);
      return;
    }
    if (editForm.extra === '' || parseFloat(editForm.extra) < 0) {
      setEditError(t.outcomes.monthlyOutcomes.errors.extraMin);
      return;
    }

    try {
      setEditSubmitting(true);
      setEditError(null);

      await api.put(`/api/monthly-outcomes/${editingOutcome.id}`, {
        month: editForm.month,
        avgift_loan: parseFloat(editForm.avgift_loan),
        debt: parseFloat(editForm.debt),
        extra: parseFloat(editForm.extra),
      });

      const response = await api.get('/api/monthly-outcomes');
      setOutcomes(response.monthlyOutcomes);

      handleCloseEdit();
    } catch (err) {
      console.error('Error updating monthly outcome:', err);
      setEditError(err instanceof Error ? err.message : 'Failed to update monthly outcome');
    } finally {
      setEditSubmitting(false);
    }
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.outcomes.monthlyOutcomes.title}</h2>

      {loading && (
        <div className="flex justify-center items-center py-8 bg-red-50 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">{t.outcomes.monthlyOutcomes.loading}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <strong>{t.errors.errorPrefix}:</strong> {error}
        </div>
      )}

      {!loading && !error && (
        <TableContainer component={Paper} className="shadow-md">
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#fee2e2' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>{t.outcomes.monthlyOutcomes.table.month}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.monthlyOutcomes.table.avgiftLoan}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.monthlyOutcomes.table.fixedCostsTotal}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.monthlyOutcomes.table.debt}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.monthlyOutcomes.table.extra}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.monthlyOutcomes.table.total}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outcomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">{t.outcomes.monthlyOutcomes.empty.title}</span>
                      <span className="text-sm">{t.outcomes.monthlyOutcomes.empty.subtitle}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                outcomes.map((outcome) => {
                  const rowTotal = calculateRowTotal(outcome);

                  return (
                    <TableRow
                      key={outcome.id}
                      onClick={() => handleRowClick(outcome)}
                      sx={{
                        cursor: 'pointer',
                        '&:hover': { backgroundColor: '#fef2f2' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell sx={{ fontSize: '15px' }}>
                        {formatMonth(outcome.month)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '15px' }}>
                        {formatCurrency(parseFloat(outcome.avgift_loan))}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontSize: '15px', fontStyle: 'italic', color: '#6b7280' }}
                      >
                        {formatCurrency(fixedCostsTotal)}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '15px' }}>
                        {formatCurrency(parseFloat(outcome.debt))}
                      </TableCell>
                      <TableCell align="right" sx={{ fontSize: '15px' }}>
                        {formatCurrency(parseFloat(outcome.extra))}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontSize: '15px', fontWeight: 600, color: '#dc2626' }}
                      >
                        {formatCurrency(rowTotal)}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={!!editingOutcome} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>{t.outcomes.monthlyOutcomes.dialog.editTitle}</DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <FormControl fullWidth>
              <InputLabel>{t.outcomes.monthlyOutcomes.dialog.month}</InputLabel>
              <Select
                value={editForm.month}
                label={t.outcomes.monthlyOutcomes.dialog.month}
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
              label={t.outcomes.monthlyOutcomes.dialog.avgiftLoan}
              type="number"
              value={editForm.avgift_loan}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, avgift_loan: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label={t.outcomes.monthlyOutcomes.dialog.debt}
              type="number"
              value={editForm.debt}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, debt: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label={t.outcomes.monthlyOutcomes.dialog.extra}
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
            {t.outcomes.monthlyOutcomes.dialog.cancel}
          </Button>
          <Button onClick={handleEditSubmit} variant="contained" disabled={editSubmitting}>
            {editSubmitting ? t.outcomes.monthlyOutcomes.dialog.saving : t.outcomes.monthlyOutcomes.dialog.save}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MonthlyOutcomesTable;
