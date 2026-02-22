import * as transactionService from './transactions.service.js';

const INCOME_CATEGORIES = ['salary', 'freelance', 'bonus', 'gift', 'investment', 'other-income'];
const EXPENSE_CATEGORIES = ['rent', 'utilities', 'food', 'transport', 'healthcare', 'entertainment', 'shopping', 'other-expense'];
const ALL_CATEGORIES = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const validateTransactionData = (data) => {
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

export const getAllTransactions = async (req, res) => {
  try {
    const { type, month, year } = req.query;

    if (month && !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ message: 'month must be in YYYY-MM format' });
    }
    if (year && !/^\d{4}$/.test(year)) {
      return res.status(400).json({ message: 'year must be a 4-digit number' });
    }

    const transactions = await transactionService.getAll(req.user.userId, { type, month, year });
    res.json({ transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ message: 'Server error while fetching transactions' });
  }
};

export const getTransactionById = async (req, res) => {
  try {
    const transaction = await transactionService.getById(req.user.userId, req.params.id);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error);
    res.status(500).json({ message: 'Server error while fetching transaction' });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, frequency, transaction_date } = req.body;

    if (!description || !amount || !type || !category || !frequency || !transaction_date) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const errors = validateTransactionData(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const transaction = await transactionService.create(req.user.userId, { description, amount, type, category, frequency, transaction_date });
    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ message: 'Server error while creating transaction' });
  }
};

export const updateTransaction = async (req, res) => {
  try {
    const { description, amount, type, category, frequency, transaction_date } = req.body;
    const fields = { description, amount, type, category, frequency, transaction_date };

    const errors = validateTransactionData(fields);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    if (!Object.values(fields).some(v => v !== undefined)) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const transaction = await transactionService.update(req.user.userId, req.params.id, fields);
    if (!transaction) return res.status(404).json({ message: 'Transaction not found' });

    res.json({ transaction });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ message: 'Server error while updating transaction' });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const deleted = await transactionService.remove(req.user.userId, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Transaction not found' });
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ message: 'Server error while deleting transaction' });
  }
};

export const getMonthlyBalance = async (req, res) => {
  try {
    const balances = await transactionService.getMonthlyBalance(req.user.userId);
    res.json({ balances });
  } catch (error) {
    console.error('Error calculating monthly balance:', error);
    res.status(500).json({ message: 'Server error while calculating balance' });
  }
};
