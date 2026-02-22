import pool from '../../db.js';

export const getAll = async (userId, { type, month, year } = {}) => {
  let query = 'SELECT * FROM transactions WHERE user_id = $1';
  const params = [userId];
  let paramCount = 1;

  if (type && ['income', 'expense'].includes(type)) {
    paramCount++;
    query += ` AND type = $${paramCount}`;
    params.push(type);
  }
  if (month) {
    paramCount++;
    query += ` AND TO_CHAR(transaction_date, 'YYYY-MM') = $${paramCount}`;
    params.push(month);
  }
  if (year) {
    paramCount++;
    query += ` AND EXTRACT(YEAR FROM transaction_date) = $${paramCount}`;
    params.push(year);
  }

  query += ' ORDER BY transaction_date DESC, created_at DESC';
  const result = await pool.query(query, params);
  return result.rows;
};

export const getById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
};

export const create = async (userId, { description, amount, type, category, frequency, transaction_date }) => {
  const result = await pool.query(
    `INSERT INTO transactions
     (user_id, description, amount, type, category, frequency, transaction_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, description, amount, type, category, frequency, transaction_date]
  );
  return result.rows[0];
};

export const update = async (userId, id, { description, amount, type, category, frequency, transaction_date }) => {
  const updates = [];
  const params = [];
  let paramCount = 0;

  if (description !== undefined) { paramCount++; updates.push(`description = $${paramCount}`); params.push(description); }
  if (amount !== undefined) { paramCount++; updates.push(`amount = $${paramCount}`); params.push(amount); }
  if (type !== undefined) { paramCount++; updates.push(`type = $${paramCount}`); params.push(type); }
  if (category !== undefined) { paramCount++; updates.push(`category = $${paramCount}`); params.push(category); }
  if (frequency !== undefined) { paramCount++; updates.push(`frequency = $${paramCount}`); params.push(frequency); }
  if (transaction_date !== undefined) { paramCount++; updates.push(`transaction_date = $${paramCount}`); params.push(transaction_date); }

  if (updates.length === 0) return null;

  params.push(id, userId);
  const query = `
    UPDATE transactions
    SET ${updates.join(', ')}
    WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
    RETURNING *
  `;
  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

export const remove = async (userId, id) => {
  const result = await pool.query(
    'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
};

export const getMonthlyBalance = async (userId) => {
  const result = await pool.query(
    `SELECT
       TO_CHAR(transaction_date, 'Mon') AS month,
       TO_CHAR(transaction_date, 'YYYY-MM') AS month_key,
       SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END) AS balance
     FROM transactions
     WHERE user_id = $1
       AND transaction_date >= CURRENT_DATE - INTERVAL '6 months'
     GROUP BY month_key, TO_CHAR(transaction_date, 'Mon'), EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)
     ORDER BY EXTRACT(YEAR FROM transaction_date), EXTRACT(MONTH FROM transaction_date)
     LIMIT 6`,
    [userId]
  );
  return result.rows.map(row => ({ month: row.month, balance: parseFloat(row.balance) }));
};
