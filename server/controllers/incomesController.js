import pool from '../db.js';

// Helper: Validate income data
const validateIncomeData = (data) => {
  const errors = [];

  if (data.salary !== undefined && (isNaN(data.salary) || data.salary < 0)) {
    errors.push('Salary must be a non-negative number');
  }

  if (data.extra !== undefined && (isNaN(data.extra) || data.extra < 0)) {
    errors.push('Extra income must be a non-negative number');
  }

  if (data.month !== undefined && !/^\d{4}-\d{2}$/.test(data.month)) {
    errors.push('Month must be in YYYY-MM format (e.g., "2026-02")');
  }

  return errors;
};

// GET /api/incomes - Get all user incomes
export const getAllIncomes = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    const result = await pool.query(
      'SELECT * FROM incomes WHERE user_id = $1 ORDER BY month DESC',
      [userId]
    );

    res.json({ incomes: result.rows });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Server error while fetching incomes' });
  }
};

// GET /api/incomes/:id - Get single income (verify ownership)
export const getIncomeById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM incomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ income: result.rows[0] });
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ message: 'Server error while fetching income' });
  }
};

// POST /api/incomes - Create new income
export const createIncome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, salary, extra } = req.body;

    // Validate required fields
    if (!month || salary === undefined || extra === undefined) {
      return res.status(400).json({ message: 'Month, salary, and extra are required' });
    }

    // Validate data
    const errors = validateIncomeData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Insert income (total is auto-calculated by DB)
    const result = await pool.query(
      `INSERT INTO incomes (user_id, month, salary, extra)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, month, salary, extra]
    );

    res.status(201).json({ income: result.rows[0] });
  } catch (error) {
    // Handle unique constraint violation (duplicate month)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Income for this month already exists' });
    }
    console.error('Error creating income:', error);
    res.status(500).json({ message: 'Server error while creating income' });
  }
};

// PUT /api/incomes/:id - Update income (verify ownership)
export const updateIncome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { month, salary, extra } = req.body;

    // Check if income exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM incomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    // Validate data if provided
    const errors = validateIncomeData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const params = [];
    let paramCount = 0;

    if (month !== undefined) {
      paramCount++;
      updates.push(`month = $${paramCount}`);
      params.push(month);
    }
    if (salary !== undefined) {
      paramCount++;
      updates.push(`salary = $${paramCount}`);
      params.push(salary);
    }
    if (extra !== undefined) {
      paramCount++;
      updates.push(`extra = $${paramCount}`);
      params.push(extra);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add id and userId to params
    params.push(id, userId);
    const query = `
      UPDATE incomes
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    res.json({ income: result.rows[0] });
  } catch (error) {
    // Handle unique constraint violation (duplicate month)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Income for this month already exists' });
    }
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Server error while updating income' });
  }
};

// DELETE /api/incomes/:id - Delete income (verify ownership)
export const deleteIncome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Income not found' });
    }

    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Server error while deleting income' });
  }
};
