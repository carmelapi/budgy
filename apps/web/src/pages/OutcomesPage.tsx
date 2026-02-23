import React, { useEffect } from 'react';
import FixedCostsTable from '../components/FixedCostsTable';
import MonthlyOutcomesTable from '../components/MonthlyOutcomesTable';
import BudgetAnalysisTable from '../components/BudgetAnalysisTable';
import { useBudget } from '../context/BudgetContext';
import { api } from '../utils/api';

const OutcomesPage: React.FC = () => {
  const { setIncomes } = useBudget();

  useEffect(() => {
    const fetchIncomes = async () => {
      try {
        const response = await api.get('/api/incomes');
        setIncomes(response.incomes);
      } catch (err) {
        console.error('Error fetching incomes for budget context:', err);
      }
    };

    fetchIncomes();
  }, [setIncomes]);

  return (
    <div className="flex flex-col gap-4 p-6 w-full overflow-auto">
      <h1 className="text-2xl font-bold text-gray-800">Outcomes</h1>

      {/* Table 1: Fixed Costs (Grey background) */}
      <FixedCostsTable />

      {/* Table 2: Monthly Outcomes (Red background) */}
      <MonthlyOutcomesTable />

      {/* Table 3: Budget Analysis (Yellow background) */}
      <BudgetAnalysisTable />
    </div>
  );
};

export default OutcomesPage;
