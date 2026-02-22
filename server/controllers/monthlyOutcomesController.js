import pool from '../db.js';

// Helper: Validate monthly outcome data
const validateMonthlyOutcomeData = (data) => {
  const errors = [];

  if (data.avgift_loan !== undefined && (isNaN(data.avgift_loan) || data.avgift_loan < 0)) {
    errors.push('Avgift/Loan must be a non-negative number');
  }

  if (data.debt !== undefined && (isNaN(data.debt) || data.debt < 0)) {
    errors.push('Debt must be a non-negative number');
  }

  if (data.extra !== undefined && (isNaN(data.extra) || data.extra < 0)) {
    errors.push('Extra must be a non-negative number');
  }

  if (data.month !== undefined && !/^\d{4}-\d{2}$/.test(data.month)) {
    errors.push('Month must be in YYYY-MM format (e.g., "2026-02")');
  }

  return errors;
};

// GET /api/monthly-outcomes - Get all user monthly outcomes
export const getAllMonthlyOutcomes = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    const result = await pool.query(
      'SELECT * FROM monthly_outcomes WHERE user_id = $1 ORDER BY month DESC',
      [userId]
    );

    res.json({ monthlyOutcomes: result.rows });
  } catch (error) {
    console.error('Error fetching monthly outcomes:', error);
    res.status(500).json({ message: 'Server error while fetching monthly outcomes' });
  }
};

// GET /api/monthly-outcomes/:id - Get single monthly outcome (verify ownership)
export const getMonthlyOutcomeById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM monthly_outcomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Monthly outcome not found' });
    }

    res.json({ monthlyOutcome: result.rows[0] });
  } catch (error) {
    console.error('Error fetching monthly outcome:', error);
    res.status(500).json({ message: 'Server error while fetching monthly outcome' });
  }
};

// POST /api/monthly-outcomes - Create new monthly outcome
export const createMonthlyOutcome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { month, avgift_loan, debt, extra } = req.body;

    // Validate required fields
    if (!month || avgift_loan === undefined || debt === undefined || extra === undefined) {
      return res.status(400).json({ message: 'Month, avgift_loan, debt, and extra are required' });
    }

    // Validate data
    const errors = validateMonthlyOutcomeData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Insert monthly outcome
    const result = await pool.query(
      `INSERT INTO monthly_outcomes (user_id, month, avgift_loan, debt, extra)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, month, avgift_loan, debt, extra]
    );

    res.status(201).json({ monthlyOutcome: result.rows[0] });
  } catch (error) {
    // Handle unique constraint violation (duplicate month)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Monthly outcome for this month already exists' });
    }
    console.error('Error creating monthly outcome:', error);
    res.status(500).json({ message: 'Server error while creating monthly outcome' });
  }
};

// PUT /api/monthly-outcomes/:id - Update monthly outcome (verify ownership)
export const updateMonthlyOutcome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { month, avgift_loan, debt, extra } = req.body;

    // Check if monthly outcome exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM monthly_outcomes WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Monthly outcome not found' });
    }

    // Validate data if provided
    const errors = validateMonthlyOutcomeData(req.body);
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
    if (avgift_loan !== undefined) {
      paramCount++;
      updates.push(`avgift_loan = $${paramCount}`);
      params.push(avgift_loan);
    }
    if (debt !== undefined) {
      paramCount++;
      updates.push(`debt = $${paramCount}`);
      params.push(debt);
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
      UPDATE monthly_outcomes
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    res.json({ monthlyOutcome: result.rows[0] });
  } catch (error) {
    // Handle unique constraint violation (duplicate month)
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Monthly outcome for this month already exists' });
    }
    console.error('Error updating monthly outcome:', error);
    res.status(500).json({ message: 'Server error while updating monthly outcome' });
  }
};

// DELETE /api/monthly-outcomes/:id - Delete monthly outcome (verify ownership)
export const deleteMonthlyOutcome = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM monthly_outcomes WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Monthly outcome not found' });
    }

    res.json({ message: 'Monthly outcome deleted successfully' });
  } catch (error) {
    console.error('Error deleting monthly outcome:', error);
    res.status(500).json({ message: 'Server error while deleting monthly outcome' });
  }
};
