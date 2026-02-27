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
import { useTranslation } from '../hooks/useTranslation';
import type { MonthlyOutcome } from '../types/incomes-outcomes.types';

const BudgetAnalysisTable: React.FC = () => {
  const { getIncomeForMonth, fixedCostsTotal } = useBudget();
  const { t } = useTranslation();

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

  const calculateMonthlyOutcomeTotal = (outcome: MonthlyOutcome): number => {
    const avgiftLoan = parseFloat(outcome.avgift_loan);
    const debt = parseFloat(outcome.debt);
    const extra = parseFloat(outcome.extra);

    return avgiftLoan + fixedCostsTotal + debt + extra;
  };

  const formatCurrency = (amount: number): string => {
    return `${amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
  };

  const formatPercentage = (value: number): string => {
    return `${value.toFixed(2)}%`;
  };

  const formatMonth = (month: string): string => {
    const [year, monthNum] = month.split('-');
    const date = new Date(parseInt(year), parseInt(monthNum) - 1);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.outcomes.budgetAnalysis.title}</h2>

      {loading && (
        <div className="flex justify-center items-center py-8 bg-yellow-50 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">{t.outcomes.budgetAnalysis.loading}</span>
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
              <TableRow sx={{ backgroundColor: '#fef9c3' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>{t.outcomes.budgetAnalysis.table.month}</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.budgetAnalysis.table.outcomesPercent}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.budgetAnalysis.table.remainingPercent}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.budgetAnalysis.table.remainingKr}
                </TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  {t.outcomes.budgetAnalysis.table.finalTotal}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {outcomes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">{t.outcomes.budgetAnalysis.empty.title}</span>
                      <span className="text-sm">{t.outcomes.budgetAnalysis.empty.subtitle}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                outcomes.map((outcome) => {
                  const month = outcome.month;
                  const income = getIncomeForMonth(month);

                  if (!income) {
                    return (
                      <TableRow key={outcome.id}>
                        <TableCell sx={{ fontSize: '15px' }}>{formatMonth(month)}</TableCell>
                        <TableCell colSpan={4} align="center" sx={{ color: '#9ca3af' }}>
                          {t.outcomes.budgetAnalysis.noIncomeForMonth}
                        </TableCell>
                      </TableRow>
                    );
                  }

                  const incomesTotal = parseFloat(income.total);
                  const outcomesTotal = calculateMonthlyOutcomeTotal(outcome);

                  const outcomesPercent = (outcomesTotal / incomesTotal) * 100;
                  const savingsGoal = 30;
                  const remainingPercent = 100 - outcomesPercent - savingsGoal;
                  const remainingInKr = (remainingPercent / 100) * incomesTotal;
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
