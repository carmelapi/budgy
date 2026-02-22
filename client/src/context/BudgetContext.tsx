import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { MonthlyIncome } from '../types/incomes-outcomes.types';

/**
 * Budget Context - Share data across Outcomes page tables
 *
 * Why needed? Table 3 (Budget Analysis) needs:
 * - Income data (to calculate percentages)
 * - Fixed costs total (from Table 1)
 *
 * Without Context, we'd need to pass data through multiple components (props drilling)
 * With Context, any component can access this data directly
 */

interface BudgetContextType {
  // Income data (fetched from /api/incomes)
  incomes: MonthlyIncome[];
  setIncomes: (incomes: MonthlyIncome[]) => void;

  // Helper: Get income for a specific month
  getIncomeForMonth: (month: string) => MonthlyIncome | undefined;

  // Fixed costs total (calculated in Table 1, used in Table 2 & 3)
  fixedCostsTotal: number;
  setFixedCostsTotal: (total: number) => void;
}

// Create Context with undefined default (will be provided by BudgetProvider)
const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

/**
 * BudgetProvider Component
 *
 * Wraps the app (or Outcomes page) to provide budget data
 * All child components can access this data using useBudget() hook
 */
export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [fixedCostsTotal, setFixedCostsTotal] = useState<number>(0);

  // Helper function: Find income for a specific month
  const getIncomeForMonth = (month: string): MonthlyIncome | undefined => {
    return incomes.find((income) => income.month === month);
  };

  const value: BudgetContextType = {
    incomes,
    setIncomes,
    getIncomeForMonth,
    fixedCostsTotal,
    setFixedCostsTotal,
  };

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
};

/**
 * useBudget Hook - Access budget data from any component
 *
 * Usage:
 * const { incomes, fixedCostsTotal } = useBudget();
 */
export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);

  if (context === undefined) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }

  return context;
};

/**
 * Junior Dev Note: What is Context?
 *
 * Context is like a "global variable" for React components.
 * Instead of passing data down through props:
 *
 * App → OutcomesPage → Table1 → Table2 → Table3
 *     props →      props →   props →  props
 *
 * We can access data directly:
 *
 * App (BudgetProvider)
 *   ├── Table1: useBudget() ✅ Gets data directly!
 *   ├── Table2: useBudget() ✅ Gets data directly!
 *   └── Table3: useBudget() ✅ Gets data directly!
 */
