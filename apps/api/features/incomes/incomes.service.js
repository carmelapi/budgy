import pool from '../../db.js';

export const getAll = async (userId) => {
  const result = await pool.query(
    'SELECT * FROM incomes WHERE user_id = $1 ORDER BY month DESC',
    [userId]
  );
  return result.rows;
};

export const getById = async (userId, id) => {
  const result = await pool.query(
    'SELECT * FROM incomes WHERE id = $1 AND user_id = $2',
    [id, userId]
  );
  return result.rows[0] || null;
};

export const create = async (userId, { month, salary, extra }, db = pool) => {
  const result = await db.query(
    `INSERT INTO incomes (user_id, month, salary, extra)
     VALUES ($1, $2, COALESCE($3::numeric, 0), COALESCE($4::numeric, 0))
     ON CONFLICT (user_id, month) DO UPDATE SET
       salary = CASE WHEN $3::numeric IS NULL THEN incomes.salary ELSE EXCLUDED.salary END,
       extra = CASE WHEN $4::numeric IS NULL THEN incomes.extra ELSE EXCLUDED.extra END
     RETURNING *`,
    [userId, month, salary ?? null, extra ?? null]
  );
  return result.rows[0];
};

export const update = async (userId, id, { month, salary, extra }) => {
  const updates = [];
  const params = [];
  let paramCount = 0;

  if (month !== undefined) { paramCount++; updates.push(`month = $${paramCount}`); params.push(month); }
  if (salary !== undefined) { paramCount++; updates.push(`salary = $${paramCount}`); params.push(salary); }
  if (extra !== undefined) { paramCount++; updates.push(`extra = $${paramCount}`); params.push(extra); }

  if (updates.length === 0) return null;

  params.push(id, userId);
  const query = `
    UPDATE incomes
    SET ${updates.join(', ')}
    WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
    RETURNING *
  `;
  const result = await pool.query(query, params);
  return result.rows[0] || null;
};

export const remove = async (userId, id) => {
  const result = await pool.query(
    'DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  );
  return result.rows[0] || null;
};
