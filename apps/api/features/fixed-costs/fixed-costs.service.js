import pool from '../../db.js';

export const getAll = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM fixed_costs WHERE user_id = $1 ORDER BY id ASC',
    [userId]
  );
  return result.rows;
};

export const getById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM fixed_costs WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
};

export const create = async (userId, { description, amount, currency, payment_source = null }) => {
  const result = await pool.query(
    `INSERT INTO fixed_costs (user_id, description, amount, currency, payment_source)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [userId, description, amount, currency, payment_source]
  );
  return result.rows[0];
};

export const update = async (userId, id, { description, amount, currency, payment_source }) => {
  const updates = [];
  const params = [];
  let paramCount = 0;

  if (description !== undefined) { paramCount++; updates.push(`description = $${paramCount}`); params.push(description); }
  if (amount !== undefined) { paramCount++; updates.push(`amount = $${paramCount}`); params.push(amount); }
  if (currency !== undefined) { paramCount++; updates.push(`currency = $${paramCount}`); params.push(currency); }
  if (payment_source !== undefined) { paramCount++; updates.push(`payment_source = $${paramCount}`); params.push(payment_source); }

  if (updates.length === 0) return null;

  params.push(id, userId);
  const query = `
    UPDATE fixed_costs
    SET ${updates.join(', ')}
    WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
    RETURNING *
  `;
  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

export const remove = async (userId, id) => {
  const result = await pool.query(
    'DELETE FROM fixed_costs WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
};
