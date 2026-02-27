import { useState, useEffect, useCallback } from 'react';
import { CircularProgress, Paper } from '@mui/material';
import { api } from '../utils/api';
import { useTranslation } from '../hooks/useTranslation';
import type { MonthlyIncome, MonthlyOutcome, FixedCost } from '../types/incomes-outcomes.types';

const formatCurrency = (amount: number): string =>
  `${amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;

const getDaysInMonth = (month: string): number => {
  const [year, monthNum] = month.split('-').map(Number);
  return new Date(year, monthNum, 0).getDate();
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

interface ToDoData {
  month: string;
  revolutTotal: number;
  bankTotal: number;
  depositTotal: number;
  dailyOutcomes: number;
}

export default function ToDo() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<ToDoData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      const [incomesRes, outcomesRes, fixedCostsRes] = await Promise.all([
        api.get('/api/incomes'),
        api.get('/api/monthly-outcomes'),
        api.get('/api/fixed-costs'),
      ]);

      const incomes: MonthlyIncome[] = incomesRes.incomes ?? [];
      const outcomes: MonthlyOutcome[] = outcomesRes.monthlyOutcomes ?? [];
      const fixedCosts: FixedCost[] = fixedCostsRes.fixedCosts ?? [];

      // Find the most recent month that has both income and outcome data
      const incomeMap = new Map(incomes.map((i) => [i.month, i]));
      const outcomeMap = new Map(outcomes.map((o) => [o.month, o]));

      const allMonths = Array.from(
        new Set([...incomes.map((i) => i.month), ...outcomes.map((o) => o.month)])
      ).sort().reverse();

      const latestMonth = allMonths.find((m) => incomeMap.has(m) && outcomeMap.has(m));
      if (!latestMonth) return;

      const income = incomeMap.get(latestMonth)!;
      const outcome = outcomeMap.get(latestMonth)!;

      const revolutTotal = fixedCosts
        .filter((fc) => fc.payment_source === 'revolut')
        .reduce((sum, fc) => sum + parseFloat(fc.amount), 0);

      const bankTotal = fixedCosts
        .filter((fc) => fc.payment_source === 'bank')
        .reduce((sum, fc) => sum + parseFloat(fc.amount), 0);

      const fixedCostsTotal = fixedCosts.reduce((sum, fc) => sum + parseFloat(fc.amount), 0);
      const totalIncomes = parseFloat(income.total);
      const finalTotal = calcFinalTotal(income, outcome, fixedCostsTotal);
      const depositTotal = totalIncomes - finalTotal;

      const dailyOutcomes = revolutTotal / getDaysInMonth(latestMonth);

      setData({ month: latestMonth, revolutTotal, bankTotal, depositTotal, dailyOutcomes });
    } catch (err) {
      console.error('[ToDo] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <Paper className="w-80 p-5 flex justify-center items-center min-h-70">
        <CircularProgress size={24} />
        <span className="ml-3 text-gray-600">{t.dashboard.todo.loading}</span>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Paper className="w-80 p-5 flex justify-center items-center min-h-70">
        <span className="text-gray-400 text-sm">{t.dashboard.todo.empty}</span>
      </Paper>
    );
  }

  const items = [
    { label: t.dashboard.todo.transferRevolut, amount: data.revolutTotal },
    { label: t.dashboard.todo.transferBank, amount: data.bankTotal },
    { label: t.dashboard.todo.transferDeposit, amount: data.depositTotal },
    { label: t.dashboard.todo.dailyOutcomes, amount: data.dailyOutcomes },
  ];

  return (
    <Paper className="w-80 p-5">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{t.dashboard.todo.title}</h2>
      <ul className="flex flex-col gap-3">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-center justify-between gap-4 py-2 border-b border-gray-100 last:border-0"
          >
            <span className="text-sm text-gray-700">{item.label}</span>
            <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
              {formatCurrency(item.amount)}
            </span>
          </li>
        ))}
      </ul>
    </Paper>
  );
}
