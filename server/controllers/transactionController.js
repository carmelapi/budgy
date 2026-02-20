import pool from '../db.js';

// Predefined categories for validation
const INCOME_CATEGORIES = ['salary', 'freelance', 'bonus', 'gift', 'investment', 'other-income'];
const EXPENSE_CATEGORIES = ['rent', 'utilities', 'food', 'transport', 'healthcare', 'entertainment', 'shopping', 'other-expense'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

// Helper: Validate transaction data
const validateTransactionData = (data, type = null) => {
  const errors = [];

  if (data.amount !== undefined && (isNaN(data.amount) || data.amount <= 0)) {
    errors.push('Amount must be a positive number');
  }

  if (data.type !== undefined && !['income', 'expense'].includes(data.type)) {
    errors.push('Type must be either "income" or "expense"');
  }

  if (data.category !== undefined && !ALL_CATEGORIES.includes(data.category)) {
    errors.push('Invalid category');
  }

  if (data.frequency !== undefined && !['monthly', 'yearly', 'one-time'].includes(data.frequency)) {
    errors.push('Frequency must be "monthly", "yearly", or "one-time"');
  }

  if (data.transaction_date !== undefined && isNaN(Date.parse(data.transaction_date))) {
    errors.push('Invalid transaction date format');
  }

  return errors;
};

// GET /api/transactions - Get all user transactions with optional filters
export const getAllTransactions = async (req, res) => {
  try {
    const userId = req.user.userId; // From JWT middleware
    const { type, month, year } = req.query;

    let query = 'SELECT * FROM transactions WHERE user_id = $1';
    const params = [userId];
    let paramCount = 1;

    // Filter by type (income/expense)
    if (type && ['income', 'expense'].includes(type)) {
      paramCount++;
      query += ` AND type = $${paramCount}`;
      params.push(type);
    }

    // Filter by month (YYYY-MM format)
    if (month) {
      paramCount++;
      query += ` AND TO_CHAR(transaction_date, 'YYYY-MM') = $${paramCount}`;
      params.push(month);
    }

    // Filter by year (YYYY format)
    if (year) {
      paramCount++;
      query += ` AND EXTRACT(YEAR FROM transaction_date) = $${paramCount}`;
      params.push(year);
    }

    query += ' ORDER BY transaction_date DESC, created_at DESC';

    const result = await pool.query(query, params);

    res.json({ transactions: result.rows });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
};

// GET /api/transactions/:id - Get single transaction (verify ownership)
export const getTransactionById = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Server error while fetching transaction' });
  }
};

// POST /api/transactions - Create new transaction
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { description, amount, type, category, frequency, transaction_date } = req.body;

    // Validate required fields
    if (!description || !amount || !type || !category || !frequency || !transaction_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate data
    const errors = validateTransactionData(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    // Insert transaction
    const result = await pool.query(
      `INSERT INTO transactions
       (user_id, description, amount, type, category, frequency, transaction_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [userId, description, amount, type, category, frequency, transaction_date]
    );

    res.status(201).json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction' });
  }
};

// PUT /api/transactions/:id - Update transaction (verify ownership)
export const updateTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;
    const { description, amount, type, category, frequency, transaction_date } = req.body;

    // Check if transaction exists and belongs to user
    const checkResult = await pool.query(
      'SELECT * FROM transactions WHERE id = $1 AND user_id = $2',
      [id, userId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Validate data if provided
    const errors = validateTransactionData(req.body);
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
    if (type !== undefined) {
      paramCount++;
      updates.push(`type = $${paramCount}`);
      params.push(type);
    }
    if (category !== undefined) {
      paramCount++;
      updates.push(`category = $${paramCount}`);
      params.push(category);
    }
    if (frequency !== undefined) {
      paramCount++;
      updates.push(`frequency = $${paramCount}`);
      params.push(frequency);
    }
    if (transaction_date !== undefined) {
      paramCount++;
      updates.push(`transaction_date = $${paramCount}`);
      params.push(transaction_date);
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    // Add id and userId to params
    params.push(id, userId);
    const query = `
      UPDATE transactions
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1} AND user_id = $${paramCount + 2}
      RETURNING *
    `;

    const result = await pool.query(query, params);
    res.json({ transaction: result.rows[0] });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error while updating transaction' });
  }
};

// DELETE /api/transactions/:id - Delete transaction (verify ownership)
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
};

// GET /api/transactions/balance/monthly - Get balance for last 6 months
export const getMonthlyBalance = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Calculate balance for last 6 months
    // Balance = SUM(income) - SUM(expense) grouped by month
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

    const balances = result.rows.map(row => ({
      month: row.month,
      balance: parseFloat(row.balance)
    }));

    res.json({ balances });
  } catch (error) {
    console.error('Error calculating monthly balance:', error);
    res.status(500).json({ message: 'Server error while calculating balance' });
  }
};
