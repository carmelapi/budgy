import pool from '../../db.js';

export const getAll = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM monthly_outcomes WHERE user_id = $1 ORDER BY month DESC',
    [userId]
  );
  return result.rows;
};

export const getById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM monthly_outcomes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
};

export const create = async (userId, { month, avgift_loan, debt, extra }) => {
  const result = await pool.query(
    `INSERT INTO monthly_outcomes (user_id, month, avgift_loan, debt, extra)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, month, avgift_loan, debt, extra]
  );
  return result.rows[0];
};

export const update = async (userId, id, { month, avgift_loan, debt, extra }) => {
  const updates = [];
  const params = [];
  let paramCount = 0;

  if (month !== undefined) { paramCount++; updates.push(`month = $${paramCount}`); params.push(month); }
  if (avgift_loan !== undefined) { paramCount++; updates.push(`avgift_loan = $${paramCount}`); params.push(avgift_loan); }
  if (debt !== undefined) { paramCount++; updates.push(`debt = $${paramCount}`); params.push(debt); }
  if (extra !== undefined) { paramCount++; updates.push(`extra = $${paramCount}`); params.push(extra); }

  if (updates.length === 0) return null;

  params.push(id, userId);
  const query = `
    UPDATE monthly_outcomes
    SET ${updates.join(', ')}
    WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
    RETURNING *
  `;
  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

export const remove = async (userId, id) => {
  const result = await pool.query(
    'DELETE FROM monthly_outcomes WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
};
