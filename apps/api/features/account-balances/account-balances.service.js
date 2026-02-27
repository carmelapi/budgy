import pool from "../../db.js";

export const upsert = async (userId, { month, amount }) => {
  // Insert or update — one balance per user per month
  const result = await pool.query(
    `INSERT INTO account_balances (user_id, month, amount)
     VALUES ($1, $2, $3)
     ON CONFLICT (user_id, month)
     DO UPDATE SET amount = EXCLUDED.amount, updated_at = CURRENT_TIMESTAMP
     RETURNING *`,
    [userId, month, amount],
  );
  return result.rows[0];
};

export const getAll = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM account_balances WHERE user_id = $1 ORDER BY month DESC",
    [userId],
  );
  return result.rows;
};
