import pool from "../../db.js";

/**
 * Replicates the finalTotal formula from BudgetAnalysisTable.tsx:
 *   outcomesTotal = avgift_loan + fixedCostsTotal + debt + extra
 *   remainingPercent = 100 - (outcomesTotal / incomesTotal * 100) - 30
 *   finalTotal = remainingPercent > 0
 *     ? outcomesTotal + (remainingPercent / 100) * incomesTotal
 *     : outcomesTotal
 */
function calcFinalTotal(incomesTotal, outcomesRaw) {
  const outcomesPercent = (outcomesRaw / incomesTotal) * 100;
  const remainingPercent = 100 - outcomesPercent - 30;
  const remainingKr = (remainingPercent / 100) * incomesTotal;
  return remainingPercent > 0 ? outcomesRaw + remainingKr : outcomesRaw;
}

export const getSummary = async (userId) => {
  // 1. User's initial balance
  const userResult = await pool.query(
    "SELECT initial_balance FROM users WHERE id = $1",
    [userId],
  );
  const initialBalance = parseFloat(userResult.rows[0]?.initial_balance ?? 0);

  // 2. All incomes keyed by month
  const incomesResult = await pool.query(
    "SELECT month, total FROM incomes WHERE user_id = $1 ORDER BY month ASC",
    [userId],
  );
  const incomesMap = {};
  for (const row of incomesResult.rows) {
    incomesMap[row.month] = parseFloat(row.total);
  }

  // 3. All monthly outcomes keyed by month
  const outcomesResult = await pool.query(
    "SELECT month, avgift_loan, debt, extra FROM monthly_outcomes WHERE user_id = $1 ORDER BY month ASC",
    [userId],
  );
  const outcomesMap = {};
  for (const row of outcomesResult.rows) {
    outcomesMap[row.month] = row;
  }

  // 4. Fixed costs total (applies to every month)
  const fixedResult = await pool.query(
    "SELECT COALESCE(SUM(amount), 0) AS total FROM fixed_costs WHERE user_id = $1",
    [userId],
  );
  const fixedCostsTotal = parseFloat(fixedResult.rows[0].total);

  // 5. Build sorted list of months that have both income and outcome data
  const allMonths = new Set([
    ...incomesResult.rows.map((r) => r.month),
    ...outcomesResult.rows.map((r) => r.month),
  ]);
  const sortedMonths = [...allMonths].sort();

  // 6. Compute per-month values with running total_on_account
  let runningTotal = initialBalance;
  const rows = [];

  for (const month of sortedMonths) {
    const incomesTotal = incomesMap[month];
    const outcomeRow = outcomesMap[month];

    // Skip months missing either side
    if (!incomesTotal || !outcomeRow) continue;

    const outcomesRaw =
      parseFloat(outcomeRow.avgift_loan) +
      fixedCostsTotal +
      parseFloat(outcomeRow.debt) +
      parseFloat(outcomeRow.extra);

    const outcomesFinal = calcFinalTotal(incomesTotal, outcomesRaw);
    const saved = incomesTotal - outcomesFinal;
    const prevTotal = runningTotal;
    runningTotal = prevTotal + saved;

    rows.push({
      month,
      incomes: incomesTotal,
      outcomes: outcomesFinal,
      saved,
      total_on_account: runningTotal,
      difference: runningTotal - prevTotal,
    });
  }

  return rows;
};
