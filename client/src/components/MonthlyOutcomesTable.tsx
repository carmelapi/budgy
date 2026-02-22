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
} from '@mui/material';
import { api } from '../utils/api';
import { useBudget } from '../context/BudgetContext';
import type { MonthlyOutcome } from '../types/incomes-outcomes.types';

const MonthlyOutcomesTable: React.FC = () => {
  const { fixedCostsTotal } = useBudget(); // Get fixed costs total from Table 1

  const [outcomes, setOutcomes] = useState<MonthlyOutcome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
                      sx={{
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
                        sx={{
                          fontSize: '15px',
                          fontStyle: 'italic',
                          color: '#6b7280',
                        }}
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
    </div>
  );
};

export default MonthlyOutcomesTable;
