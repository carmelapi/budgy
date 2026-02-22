import React, { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { MonthlyIncome } from "../types/incomes-outcomes.types";

interface BudgetContextType {
  incomes: MonthlyIncome[];
  setIncomes: (incomes: MonthlyIncome[]) => void;
  getIncomeForMonth: (month: string) => MonthlyIncome | undefined;
  fixedCostsTotal: number;
  setFixedCostsTotal: (total: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [incomes, setIncomes] = useState<MonthlyIncome[]>([]);
  const [fixedCostsTotal, setFixedCostsTotal] = useState<number>(0);

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

  return (
    <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
  );
};

export const useBudget = (): BudgetContextType => {
  const context = useContext(BudgetContext);

  if (context === undefined) {
    throw new Error("useBudget must be used within a BudgetProvider");
  }

  return context;
};
