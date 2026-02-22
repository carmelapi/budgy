import * as incomesService from './incomes.service.js';

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

export const getAllIncomes = async (req, res) => {
  try {
    const incomes = await incomesService.getAll(req.user.userId);
    res.json({ incomes });
  } catch (error) {
    console.error('Error fetching incomes:', error);
    res.status(500).json({ message: 'Server error while fetching incomes' });
  }
};

export const getIncomeById = async (req, res) => {
  try {
    const income = await incomesService.getById(req.user.userId, req.params.id);
    if (!income) return res.status(404).json({ message: 'Income not found' });
    res.json({ income });
  } catch (error) {
    console.error('Error fetching income:', error);
    res.status(500).json({ message: 'Server error while fetching income' });
  }
};

export const createIncome = async (req, res) => {
  try {
    const { month, salary, extra } = req.body;

    if (!month || salary === undefined || extra === undefined) {
      return res.status(400).json({ message: 'Month, salary, and extra are required' });
    }

    const errors = validateIncomeData(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const income = await incomesService.create(req.user.userId, { month, salary, extra });
    res.status(201).json({ income });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Income for this month already exists' });
    }
    console.error('Error creating income:', error);
    res.status(500).json({ message: 'Server error while creating income' });
  }
};

export const updateIncome = async (req, res) => {
  try {
    const { month, salary, extra } = req.body;
    const fields = { month, salary, extra };

    const errors = validateIncomeData(fields);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    if (!Object.values(fields).some(v => v !== undefined)) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const income = await incomesService.update(req.user.userId, req.params.id, fields);
    if (!income) return res.status(404).json({ message: 'Income not found' });

    res.json({ income });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Income for this month already exists' });
    }
    console.error('Error updating income:', error);
    res.status(500).json({ message: 'Server error while updating income' });
  }
};

export const deleteIncome = async (req, res) => {
  try {
    const deleted = await incomesService.remove(req.user.userId, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Income not found' });
    res.json({ message: 'Income deleted successfully' });
  } catch (error) {
    console.error('Error deleting income:', error);
    res.status(500).json({ message: 'Server error while deleting income' });
  }
};
