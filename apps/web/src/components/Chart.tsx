import { useState, useEffect, useCallback } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { CircularProgress, Paper } from '@mui/material';
import { api } from '../utils/api';
import { useTranslation } from '../hooks/useTranslation';
import type { MonthlyIncome, MonthlyOutcome, FixedCost } from '../types/incomes-outcomes.types';

interface AccountBalance {
  id: number;
  user_id: number;
  month: string;
  amount: string;
}

const formatMonth = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const calcFinalTotal = (
  income: MonthlyIncome,
  outcome: MonthlyOutcome,
  fixedCostsTotal: number
): number => {
  const incomesTotal = parseFloat(income.total);
  const outcomesTotal =
    parseFloat(outcome.avgift_loan) +
    fixedCostsTotal +
    parseFloat(outcome.debt) +
    parseFloat(outcome.extra);
  const outcomesPercent = (outcomesTotal / incomesTotal) * 100;
  const savingsGoal = 30;
  const remainingPercent = 100 - outcomesPercent - savingsGoal;
  const remainingInKr = (remainingPercent / 100) * incomesTotal;
  return remainingPercent > 0 ? outcomesTotal + remainingInKr : outcomesTotal;
};

const getPreviousMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export default function Chart() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [months, setMonths] = useState<string[]>([]);
  const [totalAccounts, setTotalAccounts] = useState<number[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [incomesRes, outcomesRes, fixedCostsRes, balancesRes] = await Promise.all([
        api.get('/api/incomes'),
        api.get('/api/monthly-outcomes'),
        api.get('/api/fixed-costs'),
        api.get('/api/account-balances'),
      ]);

      const incomes: MonthlyIncome[] = incomesRes.incomes ?? [];
      const outcomes: MonthlyOutcome[] = outcomesRes.monthlyOutcomes ?? [];
      const fixedCosts: FixedCost[] = fixedCostsRes.fixedCosts ?? [];
      const balances: AccountBalance[] = balancesRes.balances ?? [];

      const fixedCostsTotal = fixedCosts.reduce((sum, fc) => sum + parseFloat(fc.amount), 0);

      const incomeMap = new Map(incomes.map((i) => [i.month, i]));
      const outcomeMap = new Map(outcomes.map((o) => [o.month, o]));
      const balanceMap = new Map(balances.map((b) => [b.month, parseFloat(b.amount)]));

      // Oldest → newest for left-to-right chart flow
      const allMonths = Array.from(
        new Set([...incomes.map((i) => i.month), ...outcomes.map((o) => o.month)])
      ).sort();

      const filteredMonths: string[] = [];
      const filteredTotals: number[] = [];

      for (const month of allMonths) {
        const income = incomeMap.get(month);
        const outcome = outcomeMap.get(month);
        if (!income || !outcome) continue;

        const totalIncomes = parseFloat(income.total);
        const finalTotal = calcFinalTotal(income, outcome, fixedCostsTotal);

        const prevMonth = getPreviousMonth(month);
        const prevBalance = balanceMap.get(prevMonth);
        if (prevBalance === undefined) continue;

        const totalAccount = prevBalance + (totalIncomes - finalTotal);
        filteredMonths.push(formatMonth(month));
        filteredTotals.push(Math.round(totalAccount));
      }

      setMonths(filteredMonths);
      setTotalAccounts(filteredTotals);
    } catch (err) {
      console.error('[Chart] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Paper className="flex-1 p-5 flex justify-center items-center min-h-[280px]">
        <CircularProgress size={24} />
        <span className="ml-3 text-gray-600">{t.dashboard.chart.loading}</span>
      </Paper>
    );
  }

  if (months.length === 0) {
    return (
      <Paper className="flex-1 p-5 flex justify-center items-center min-h-[280px]">
        <span className="text-gray-400 text-sm">{t.dashboard.chart.empty}</span>
      </Paper>
    );
  }

  return (
    <Paper className="flex-1 p-5">
      <h2 className="text-xl font-semibold mb-2 text-gray-800">{t.dashboard.chart.title}</h2>
      <LineChart
        xAxis={[{ scaleType: 'point', data: months }]}
        series={[
          {
            data: totalAccounts,
            label: t.dashboard.chart.totalAccount,
            color: '#16a34a',
            showMark: true,
          },
        ]}
        height={240}
        margin={{ left: 80, right: 20, top: 20, bottom: 40 }}
      />
    </Paper>
  );
}
