import { useState, useEffect, useCallback } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from '@mui/material';
import { api } from '../utils/api';
import { useTranslation } from '../hooks/useTranslation';
import type { MonthlyIncome, MonthlyOutcome, FixedCost } from '../types/incomes-outcomes.types';

interface AccountBalance {
  id: number;
  user_id: number;
  month: string;
  amount: string;
}

interface DashboardRow {
  month: string;
  totalIncomes: number | null;
  finalTotal: number | null;
  totalAccount: number | null;
}

const formatMonth = (month: string): string => {
  const [year, monthNum] = month.split('-');
  const date = new Date(parseInt(year), parseInt(monthNum) - 1);
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

const formatCurrency = (amount: number): string => {
  return `${amount.toLocaleString('sv-SE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} kr`;
};

/** Same formula as BudgetAnalysisTable */
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

/** Returns the month string for the month before the given one */
const getPreviousMonth = (month: string): string => {
  const [year, monthNum] = month.split('-').map(Number);
  const date = new Date(year, monthNum - 2, 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

export default function DashboardTable() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<DashboardRow[]>([]);
  const [balanceMap, setBalanceMap] = useState<Map<string, number>>(new Map());

  // Edit dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogPrevMonth, setDialogPrevMonth] = useState('');
  const [dialogAmount, setDialogAmount] = useState('');
  const [dialogSubmitting, setDialogSubmitting] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
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

      if (!incomes.length) console.log('[DashboardTable] No incomes data');
      if (!outcomes.length) console.log('[DashboardTable] No monthly outcomes data');
      if (!fixedCosts.length) console.log('[DashboardTable] No fixed costs data');
      if (!balances.length) console.log('[DashboardTable] No account balances data');

      const incomeMap = new Map(incomes.map((i) => [i.month, i]));
      const outcomeMap = new Map(outcomes.map((o) => [o.month, o]));
      const newBalanceMap = new Map(balances.map((b) => [b.month, parseFloat(b.amount)]));
      setBalanceMap(newBalanceMap);

      const allMonths = Array.from(
        new Set([...incomes.map((i) => i.month), ...outcomes.map((o) => o.month)])
      ).sort().reverse();

      if (!allMonths.length) console.log('[DashboardTable] No months found across incomes or outcomes');

      const builtRows: DashboardRow[] = allMonths.map((month) => {
        const income = incomeMap.get(month);
        const outcome = outcomeMap.get(month);

        if (!income) console.log(`[DashboardTable] Missing income for month ${month}`);
        if (!outcome) console.log(`[DashboardTable] Missing monthly outcome for month ${month}`);

        const totalIncomes = income ? parseFloat(income.total) : null;
        const finalTotal =
          income && outcome ? calcFinalTotal(income, outcome, fixedCostsTotal) : null;

        const prevMonth = getPreviousMonth(month);
        const prevBalance = newBalanceMap.get(prevMonth);

        if (prevBalance === undefined) {
          console.log(
            `[DashboardTable] No account balance for previous month (${prevMonth}) — needed for Total Account of ${month}`
          );
        }

        let totalAccount: number | null = null;
        if (prevBalance !== undefined && totalIncomes !== null && finalTotal !== null) {
          totalAccount = prevBalance + (totalIncomes - finalTotal);
        }

        return { month, totalIncomes, finalTotal, totalAccount };
      });

      setRows(builtRows);
    } catch (err) {
      console.error('[DashboardTable] Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const handleRowClick = (row: DashboardRow) => {
    const prevMonth = getPreviousMonth(row.month);
    const existingBalance = balanceMap.get(prevMonth);
    setDialogPrevMonth(prevMonth);
    setDialogAmount(existingBalance !== undefined ? String(existingBalance) : '');
    setDialogError(null);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogError(null);
  };

  const handleDialogSave = async () => {
    if (!dialogAmount || isNaN(Number(dialogAmount))) return;
    try {
      setDialogSubmitting(true);
      setDialogError(null);
      await api.post('/api/account-balances', {
        month: dialogPrevMonth,
        amount: Number(dialogAmount),
      });
      setDialogOpen(false);
      await fetchAll();
    } catch (err: any) {
      setDialogError(err.message || t.navbar.addDialog.somethingWentWrong);
    } finally {
      setDialogSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <CircularProgress size={24} />
        <span className="ml-3 text-gray-600">{t.dashboard.table.loading}</span>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">{t.dashboard.table.title}</h2>
      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f0fdf4' }}>
              <TableCell sx={{ fontWeight: 600, fontSize: '16px' }}>{t.dashboard.table.month}</TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                {t.dashboard.table.totalIncomes}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                {t.dashboard.table.finalTotal}
              </TableCell>
              <TableCell sx={{ fontWeight: 600, fontSize: '16px' }} align="right">
                {t.dashboard.table.totalAccount}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6, color: '#9ca3af' }}>
                  {t.dashboard.table.empty}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.month}
                  onClick={() => handleRowClick(row)}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': { backgroundColor: '#f0fdf4' },
                    transition: 'background-color 0.2s',
                  }}
                >
                  <TableCell sx={{ fontSize: '15px' }}>{formatMonth(row.month)}</TableCell>
                  <TableCell align="right" sx={{ fontSize: '15px' }}>
                    {row.totalIncomes !== null ? formatCurrency(row.totalIncomes) : 'null'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '15px' }}>
                    {row.finalTotal !== null ? formatCurrency(row.finalTotal) : 'null'}
                  </TableCell>
                  <TableCell align="right" sx={{ fontSize: '15px', fontWeight: 600 }}>
                    {row.totalAccount !== null ? formatCurrency(row.totalAccount) : 'null'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Edit bank balance dialog */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="xs" fullWidth>
        <DialogTitle>
          {t.dashboard.table.editBalanceTitle} — {formatMonth(dialogPrevMonth)}
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 mt-2">
            <TextField
              label={t.dashboard.table.balanceAmount}
              type="number"
              fullWidth
              value={dialogAmount}
              onChange={(e) => setDialogAmount(e.target.value)}
              disabled={dialogSubmitting}
              inputProps={{ min: 0, step: 0.01 }}
              autoFocus
            />
            {dialogError && (
              <p className="text-red-500 text-sm">{dialogError}</p>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={dialogSubmitting}>
            {t.navbar.settings.cancel}
          </Button>
          <Button
            onClick={handleDialogSave}
            variant="contained"
            disabled={dialogSubmitting || !dialogAmount}
          >
            {dialogSubmitting ? t.navbar.settings.saving : t.navbar.settings.save}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
