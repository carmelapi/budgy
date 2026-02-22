import * as monthlyOutcomesService from './monthly-outcomes.service.js';

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

export const getAllMonthlyOutcomes = async (req, res) => {
  try {
    const monthlyOutcomes = await monthlyOutcomesService.getAll(req.user.userId);
    res.json({ monthlyOutcomes });
  } catch (error) {
    console.error('Error fetching monthly outcomes:', error);
    res.status(500).json({ message: 'Server error while fetching monthly outcomes' });
  }
};

export const getMonthlyOutcomeById = async (req, res) => {
  try {
    const monthlyOutcome = await monthlyOutcomesService.getById(req.user.userId, req.params.id);
    if (!monthlyOutcome) return res.status(404).json({ message: 'Monthly outcome not found' });
    res.json({ monthlyOutcome });
  } catch (error) {
    console.error('Error fetching monthly outcome:', error);
    res.status(500).json({ message: 'Server error while fetching monthly outcome' });
  }
};

export const createMonthlyOutcome = async (req, res) => {
  try {
    const { month, avgift_loan, debt, extra } = req.body;

    if (!month || avgift_loan === undefined || debt === undefined || extra === undefined) {
      return res.status(400).json({ message: 'Month, avgift_loan, debt, and extra are required' });
    }

    const errors = validateMonthlyOutcomeData(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const monthlyOutcome = await monthlyOutcomesService.create(req.user.userId, { month, avgift_loan, debt, extra });
    res.status(201).json({ monthlyOutcome });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Monthly outcome for this month already exists' });
    }
    console.error('Error creating monthly outcome:', error);
    res.status(500).json({ message: 'Server error while creating monthly outcome' });
  }
};

export const updateMonthlyOutcome = async (req, res) => {
  try {
    const { month, avgift_loan, debt, extra } = req.body;
    const fields = { month, avgift_loan, debt, extra };

    const errors = validateMonthlyOutcomeData(fields);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    if (!Object.values(fields).some(v => v !== undefined)) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const monthlyOutcome = await monthlyOutcomesService.update(req.user.userId, req.params.id, fields);
    if (!monthlyOutcome) return res.status(404).json({ message: 'Monthly outcome not found' });

    res.json({ monthlyOutcome });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ message: 'Monthly outcome for this month already exists' });
    }
    console.error('Error updating monthly outcome:', error);
    res.status(500).json({ message: 'Server error while updating monthly outcome' });
  }
};

export const deleteMonthlyOutcome = async (req, res) => {
  try {
    const deleted = await monthlyOutcomesService.remove(req.user.userId, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Monthly outcome not found' });
    res.json({ message: 'Monthly outcome deleted successfully' });
  } catch (error) {
    console.error('Error deleting monthly outcome:', error);
    res.status(500).json({ message: 'Server error while deleting monthly outcome' });
  }
};
