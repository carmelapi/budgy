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

/**
 * Budget Analysis Table Component
 *
 * Shows budget analysis with percentages and final calculations
 * - Yellow background
 * - Complex formulas based on incomes and outcomes
 * - Columns: Month | Outcomes % | Remaining % | Remaining (kr) | Final Total
 */
const BudgetAnalysisTable: React.FC = () => {
  const { getIncomeForMonth, fixedCostsTotal } = useBudget();

  const [outcomes, setOutcomes] = useState<MonthlyOutcome[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch monthly outcomes (same data as Table 2)
   */
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

  /**
   * Calculate monthly outcome total (same as Table 2)
   */
  const calculateMonthlyOutcomeTotal = (outcome: MonthlyOutcome): number => {
    const avgiftLoan = parseFloat(outcome.avgift_loan);
    const debt = parseFloat(outcome.debt);
    const extra = parseFloat(outcome.extra);

    return avgiftLoan + fixedCostsTotal + debt + extra;
  };

  /**
   * Format currency
   */
  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  /**
   * Format percentage
   */
  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  /**
   * Format month (2026-02 → Feb 2026)
   */
  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Table 3: Budget Analysis</h2>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8 bg-yellow-50 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">Loading budget analysis...</span>
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
              <TableRow sx={{ backgroundColor: '#fef9c3' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>Month</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Outcomes %
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Remaining %
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Remaining (kr)
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Final Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outcomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">No budget analysis data yet</span>
                      <span className="text-sm">Add income and outcome data to see analysis</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                outcomes.map((outcome) => {
                  const month = outcome.month;
                  const income = getIncomeForMonth(month);

                  // If no income data for this month, skip calculations
                  if (!income) {
                    return (
                      <TableRow key={outcome.id}>
                        <TableCell sx={{ fontSize: '15px' }}>{formatMonth(month)}</TableCell>
                        <TableCell colSpan={4} align="center" sx={{ color: '#9ca3af' }}>
                          No income data for this month
                        </TableCell>
                      </TableRow>
                    );
                  }

                  const incomesTotal = parseFloat(income.total);
                  const outcomesTotal = calculateMonthlyOutcomeTotal(outcome);

                  /**
                   * Formula 1: Outcomes Percentage
                   * Shows what % of income goes to expenses
                   * Example: 15,000 kr expenses ÷ 30,000 kr income × 100 = 50%
                   */
                  const outcomesPercent = (outcomesTotal / incomesTotal) * 100;

                  /**
                   * Formula 2: Remaining Percentage
                   * 30% is savings goal (hardcoded requirement)
                   * Remaining = 100% - outcomes% - 30% savings
                   * Example: 100% - 50% - 30% = 20%
                   */
                  const savingsGoal = 30;
                  const remainingPercent = 100 - outcomesPercent - savingsGoal;

                  /**
                   * Formula 3: Remaining in kr
                   * Convert percentage back to SEK amount
                   * Example: 20% of 30,000 kr = 6,000 kr
                   */
                  const remainingInKr = (remainingPercent / 100) * incomesTotal;

                  /**
                   * Formula 4: Final Total Outcomes
                   * If budget is positive (remainingPercent > 0): add leftover money to expenses
                   * If budget is negative (remainingPercent ≤ 0): just show expenses
                   *
                   * Why? If you have money left over, it counts as "used budget"
                   */
                  const finalTotal =
                    remainingPercent > 0 ? outcomesTotal + remainingInKr : outcomesTotal;

                  return (
                    <TableRow
                      key={outcome.id}
                      sx={{
                        '&:hover': { backgroundColor: '#fefce8' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell sx={{ fontSize: '15px' }}>{formatMonth(month)}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '15px' }}>
                        {formatPercentage(outcomesPercent)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: '15px',
                          // Red if negative, green if positive
                          color: remainingPercent < 0 ? '#dc2626' : '#059669',
                        }}
                      >
                        {formatPercentage(remainingPercent)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{
                          fontSize: '15px',
                          color: remainingInKr < 0 ? '#dc2626' : '#059669',
                        }}
                      >
                        {formatCurrency(remainingInKr)}
                      </TableCell>
                      <TableCell
                        align="right"
                        sx={{ fontSize: '15px', fontWeight: 600, color: '#ca8a04' }}
                      >
                        {formatCurrency(finalTotal)}
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

export default BudgetAnalysisTable;
