import * as fixedCostsService from './fixed-costs.service.js';

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

export const getAllFixedCosts = async (req, res) => {
  try {
    const fixedCosts = await fixedCostsService.getAll(req.user.userId);
    res.json({ fixedCosts });
  } catch (error) {
    console.error('Error fetching fixed costs:', error);
    res.status(500).json({ message: 'Server error while fetching fixed costs' });
  }
};

export const getFixedCostById = async (req, res) => {
  try {
    const fixedCost = await fixedCostsService.getById(req.user.userId, req.params.id);
    if (!fixedCost) return res.status(404).json({ message: 'Fixed cost not found' });
    res.json({ fixedCost });
  } catch (error) {
    console.error('Error fetching fixed cost:', error);
    res.status(500).json({ message: 'Server error while fetching fixed cost' });
  }
};

export const createFixedCost = async (req, res) => {
  try {
    const { description, amount, currency = 'SEK', payment_source = null } = req.body;

    if (!description || amount === undefined) {
      return res.status(400).json({ message: 'Description and amount are required' });
    }

    const errors = validateFixedCostData(req.body);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    const fixedCost = await fixedCostsService.create(req.user.userId, { description, amount, currency, payment_source });
    res.status(201).json({ fixedCost });
  } catch (error) {
    console.error('Error creating fixed cost:', error);
    res.status(500).json({ message: 'Server error while creating fixed cost' });
  }
};

export const updateFixedCost = async (req, res) => {
  try {
    const { description, amount, currency, payment_source } = req.body;
    const fields = { description, amount, currency, payment_source };

    const errors = validateFixedCostData(fields);
    if (errors.length > 0) return res.status(400).json({ message: 'Validation failed', errors });

    if (!Object.values(fields).some(v => v !== undefined)) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const fixedCost = await fixedCostsService.update(req.user.userId, req.params.id, fields);
    if (!fixedCost) return res.status(404).json({ message: 'Fixed cost not found' });

    res.json({ fixedCost });
  } catch (error) {
    console.error('Error updating fixed cost:', error);
    res.status(500).json({ message: 'Server error while updating fixed cost' });
  }
};

export const deleteFixedCost = async (req, res) => {
  try {
    const deleted = await fixedCostsService.remove(req.user.userId, req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Fixed cost not found' });
    res.json({ message: 'Fixed cost deleted successfully' });
  } catch (error) {
    console.error('Error deleting fixed cost:', error);
    res.status(500).json({ message: 'Server error while deleting fixed cost' });
  }
};
