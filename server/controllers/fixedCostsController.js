import pool from '../db.js';

// Helper: Validate fixed cost data
const validateFixedCostData = (data) => {
  const errors = [];

  if (data.description !== undefined && !data.description.trim()) {
    errors.push('Description is required');
  }

  if (data.amount !== undefined && (isNaN(data.amount) || data.amount <= 0)) {
    errors.push('Amount must be a positive number');
  }

  if (data.currency !== undefined && !['SEK', 'EUR'].includes(data.currency)) {
    errors.push('Currency must be either "SEK" or "EUR"');
  }

  return errors;
};

// GET /api/fixed-costs - Get all user fixed costs
export const getAllFixedCosts = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware

    const result = await pool.query(
      'SELECT * FROM fixed_costs WHERE user_id = $1 ORDER BY id ASC',
      [userId]
    );

    res.json({ fixedCosts: result.rows });
  } catch (error) {
    console.error('Error fetching fixed costs:', error);
    res.status(500).json({ message: 'Server error while fetching fixed costs' });
  }
};

// GET /api/fixed-costs/:id - Get single fixed cost (verify ownership)
export const getFixedCostById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM fixed_costs WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fixed cost not found' });
    }

    res.json({ fixedCost: result.rows[0] });
  } catch (error) {
    console.error('Error fetching fixed cost:', error);
    res.status(500).json({ message: 'Server error while fetching fixed cost' });
  }
};

// POST /api/fixed-costs - Create new fixed cost
export const createFixedCost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description, amount, currency = 'SEK' } = req.body;

    // Validate required fields
    if (!description || amount === undefined) {
      return res.status(400).json({ message: 'Description and amount are required' });
    }

    // Validate data
    const errors = validateFixedCostData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Insert fixed cost
    const result = await pool.query(
      `INSERT INTO fixed_costs (user_id, description, amount, currency)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, description, amount, currency]
    );

    res.status(201).json({ fixedCost: result.rows[0] });
  } catch (error) {
    console.error('Error creating fixed cost:', error);
    res.status(500).json({ message: 'Server error while creating fixed cost' });
  }
};

// PUT /api/fixed-costs/:id - Update fixed cost (verify ownership)
export const updateFixedCost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { description, amount, currency } = req.body;

    // Check if fixed cost exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM fixed_costs WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Fixed cost not found' });
    }

    // Validate data if provided
    const errors = validateFixedCostData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Build update query dynamically based on provided fields
    const updates = [];
    const params = [];
    let paramCount = 0;

    if (description !== undefined) {
      paramCount++;
      updates.push(`description = $${paramCount}`);
      params.push(description);
    }
    if (amount !== undefined) {
      paramCount++;
      updates.push(`amount = $${paramCount}`);
      params.push(amount);
    }
    if (currency !== undefined) {
      paramCount++;
      updates.push(`currency = $${paramCount}`);
      params.push(currency);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add id and userId to params
    params.push(id, userId);
    const query = `
      UPDATE fixed_costs
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    res.json({ fixedCost: result.rows[0] });
  } catch (error) {
    console.error('Error updating fixed cost:', error);
    res.status(500).json({ message: 'Server error while updating fixed cost' });
  }
};

// DELETE /api/fixed-costs/:id - Delete fixed cost (verify ownership)
export const deleteFixedCost = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM fixed_costs WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Fixed cost not found' });
    }

    res.json({ message: 'Fixed cost deleted successfully' });
  } catch (error) {
    console.error('Error deleting fixed cost:', error);
    res.status(500).json({ message: 'Server error while deleting fixed cost' });
  }
};
