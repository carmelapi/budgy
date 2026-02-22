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
import type { MonthlyOutcome } from '../types/incomes-outcomes.types';

// Generates months from 3 months ago to 6 months ahead for the Select dropdown
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
  const { fixedCostsTotal } = useBudget(); // Get fixed costs total from Table 1

  const [outcomes, setOutcomes] = useState<MonthlyOutcome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Edit dialog state — null means no row is selected (dialog closed)
  const [editingOutcome, setEditingOutcome] = useState<MonthlyOutcome | null>(null);
  const [editForm, setEditForm] = useState({ month: '', avgift_loan: '', debt: '', extra: '' });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Extracted so we can call it again after a successful edit
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

  // Opens the edit dialog pre-filled with the clicked row's data
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
      setEditError('Month is required');
      return;
    }
    if (editForm.avgift_loan === '' || parseFloat(editForm.avgift_loan) < 0) {
      setEditError('Avgift + Loan must be 0 or greater');
      return;
    }
    if (editForm.debt === '' || parseFloat(editForm.debt) < 0) {
      setEditError('Debt must be 0 or greater');
      return;
    }
    if (editForm.extra === '' || parseFloat(editForm.extra) < 0) {
      setEditError('Extra must be 0 or greater');
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

      // Re-fetch so the table shows fresh data without a full page reload
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
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Table 2: Monthly Outcomes</h2>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8 bg-red-50 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">Loading monthly outcomes...</span>
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
              <TableRow sx={{ backgroundColor: '#fee2e2' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Avgift + Loan
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Fixed Costs Total
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Debt
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Extra
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outcomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">No monthly outcomes yet</span>
                      <span className="text-sm">Start tracking your monthly expenses</span>
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

      {/* Edit Monthly Outcome Dialog */}
      <Dialog open={!!editingOutcome} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Monthly Outcome</DialogTitle>
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
              label="Avgift + Loan (kr)"
              type="number"
              value={editForm.avgift_loan}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, avgift_loan: e.target.value }))
              }
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              label="Debt (kr)"
              type="number"
              value={editForm.debt}
              onChange={(e) =>
                setEditForm((prev) => ({ ...prev, debt: e.target.value }))
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

            {/* Fixed Costs Total is auto-calculated — not shown here */}

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
            {editSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MonthlyOutcomesTable;
