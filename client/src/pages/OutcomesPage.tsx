import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import FixedCostsTable from '../components/FixedCostsTable';
import MonthlyOutcomesTable from '../components/MonthlyOutcomesTable';
import BudgetAnalysisTable from '../components/BudgetAnalysisTable';
import { useBudget } from '../context/BudgetContext';
import { api } from '../utils/api';

/**
 * Outcomes Page Component
 *
 * Main page that combines 3 tables:
 * 1. Fixed Costs (grey) - Recurring expenses with EUR conversion
 * 2. Monthly Outcomes (red) - Monthly expense breakdown
 * 3. Budget Analysis (yellow) - Budget calculations and percentages
 *
 * Why separate components? Each table has complex logic.
 * Splitting makes code easier to read and maintain.
 */
const OutcomesPage: React.FC = () => {
  const { setIncomes } = useBudget();

  /**
   * Fetch income data for budget calculations
   * Table 3 (Budget Analysis) needs this to calculate percentages
   */
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
    <>
      <Navbar />
      <div className="flex flex-row w-full h-[calc(100vh-60px)]">
        <Sidebar />

        {/* Main content area */}
        <div className="flex flex-col gap-4 p-6 w-full overflow-auto">
          <h1 className="text-2xl font-bold text-gray-800">Outcomes</h1>

          {/* Table 1: Fixed Costs (Grey background) */}
          <FixedCostsTable />

          {/* Table 2: Monthly Outcomes (Red background) */}
          <MonthlyOutcomesTable />

          {/* Table 3: Budget Analysis (Yellow background) */}
          <BudgetAnalysisTable />
        </div>
      </div>
    </>
  );
};

export default OutcomesPage;
