import React, { useState } from 'react';
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import type { Transaction } from '../types/dashboard.types';

// Static data for each tab
const monthlyExpenses: Transaction[] = [
  { id: 1, description: 'Rent', amount: -1200, date: '2026-02-01', category: 'housing' },
  { id: 2, description: 'Groceries', amount: -350, date: '2026-02-05', category: 'food' },
  { id: 3, description: 'Utilities', amount: -120, date: '2026-02-10', category: 'bills' },
  { id: 4, description: 'Internet', amount: -45, date: '2026-02-12', category: 'bills' },
  { id: 5, description: 'Gym Membership', amount: -35, date: '2026-02-15', category: 'health' },
];

const incomes: Transaction[] = [
  { id: 6, description: 'Salary', amount: 3500, date: '2026-02-01', category: 'salary' },
  { id: 7, description: 'Freelance Project', amount: 800, date: '2026-02-15', category: 'freelance' },
  { id: 8, description: 'Gift', amount: 100, date: '2026-02-20', category: 'gift' },
];

const oneTimeExpenses: Transaction[] = [
  { id: 9, description: 'New Laptop', amount: -1200, date: '2026-02-03', category: 'electronics' },
  { id: 10, description: 'Concert Tickets', amount: -80, date: '2026-02-08', category: 'entertainment' },
  { id: 11, description: 'Winter Jacket', amount: -150, date: '2026-02-18', category: 'clothing' },
];

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Helper function to format currency
const formatAmount = (amount: number): string => {
  const abs = Math.abs(amount);
  return amount < 0 ? `-€${abs.toFixed(2)}` : `€${abs.toFixed(2)}`;
};

const TransactionTable: React.FC = () => {
  // State to track which tab is active (0 = Monthly, 1 = Incomes, 2 = Outcomes)
  const [activeTab, setActiveTab] = useState(0);

  // Handle tab change
  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  // Get data based on active tab
  const getCurrentData = (): Transaction[] => {
    switch (activeTab) {
      case 0:
        return monthlyExpenses;
      case 1:
        return incomes;
      case 2:
        return oneTimeExpenses;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  return (
    <div className="bg-white rounded-lg shadow-md">
      {/* Tabs navigation */}
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '& .MuiTab-root': {
            textTransform: 'none',
            fontSize: "13px",
            fontWeight: 500,
          },
        }}
      >
        <Tab label="Monthly Expenses" />
        <Tab label="Incomes" />
        <Tab label="One-Time Expenses" />
      </Tabs>

      {/* Table content */}
      <TableContainer component={Paper} elevation={0}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Description</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">
                Amount
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentData.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 4, color: '#9ca3af' }}>
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              // Map through transactions
              currentData.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  sx={{
                    '&:hover': { backgroundColor: '#f9fafb' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ color: '#6b7280' }}>
                    {formatDate(transaction.date)}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      fontWeight: 600,
                      // Red for expenses, green for incomes
                      color: transaction.amount < 0 ? '#ef4444' : '#10b981',
                    }}
                  >
                    {formatAmount(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TransactionTable;
