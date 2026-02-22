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
  Button,
} from '@mui/material';
import { api } from '../utils/api';
import { fetchExchangeRate, formatCurrencyWithConversion } from '../utils/currency';
import { useBudget } from '../context/BudgetContext';
import type { FixedCost } from '../types/incomes-outcomes.types';

const FixedCostsTable: React.FC = () => {
  const { setFixedCostsTotal } = useBudget();

  const [fixedCosts, setFixedCosts] = useState<FixedCost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [costsResponse, rate] = await Promise.all([
          api.get('/api/fixed-costs'),
          fetchExchangeRate(),
        ]);

        setFixedCosts(costsResponse.fixedCosts);
        setExchangeRate(rate);
      } catch (err) {
        console.error('Error fetching fixed costs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load fixed costs');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateGrandTotal = (): number => {
    if (!exchangeRate) return 0;

    return fixedCosts.reduce((sum, cost) => {
      const amount = parseFloat(cost.amount);

      if (cost.currency === 'EUR') {
        return sum + amount * exchangeRate;
      }

      return sum + amount;
    }, 0);
  };

  const grandTotal = calculateGrandTotal();

  useEffect(() => {
    setFixedCostsTotal(grandTotal);
  }, [grandTotal, setFixedCostsTotal]);

  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Table 1: Fixed Costs</h2>

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center items-center py-8 bg-gray-100 rounded-lg">
          <CircularProgress size={24} />
          <span className="ml-3 text-gray-600">Loading fixed costs and exchange rates...</span>
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
              <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                  Amount
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fixedCosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-lg">No fixed costs yet</span>
                      <span className="text-sm">Add your recurring monthly expenses</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {/* Map through fixed costs */}
                  {fixedCosts.map((cost) => (
                    <TableRow
                      key={cost.id}
                      sx={{
                        '&:hover': { backgroundColor: '#f9fafb' },
                        transition: 'background-color 0.2s',
                      }}
                    >
                      <TableCell sx={{ fontSize: '15px' }}>{cost.description}</TableCell>
                      <TableCell align="right" sx={{ fontSize: '15px' }}>
                        {formatCurrencyWithConversion(
                          parseFloat(cost.amount),
                          cost.currency,
                          exchangeRate || undefined
                        )}
                      </TableCell>
                    </TableRow>
                  ))}

                  {/* Grand Total Footer Row */}
                  <TableRow sx={{ backgroundColor: '#e5e7eb' }}>
                    <TableCell sx={{ fontWeight: 700, fontSize: '16px' }}>Grand Total</TableCell>
                    <TableCell
                      align="right"
                      sx={{ fontWeight: 700, fontSize: '16px', color: '#1f2937' }}
                    >
                      {grandTotal.toLocaleString('sv-SE', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}{' '}
                      kr
                    </TableCell>
                  </TableRow>
                </>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add button (no functionality yet, just UI) */}
      {!loading && !error && (
        <div className="mt-3">
          <Button variant="outlined" size="small">
            + Add Fixed Cost
          </Button>
        </div>
      )}
    </div>
  );
};

export default FixedCostsTable;
