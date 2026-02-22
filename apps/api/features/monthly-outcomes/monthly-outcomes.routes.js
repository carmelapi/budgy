import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  getAllMonthlyOutcomes,
  getMonthlyOutcomeById,
  createMonthlyOutcome,
  updateMonthlyOutcome,
  deleteMonthlyOutcome
} from './monthly-outcomes.controller.js';

const router = express.Router();

// All routes require JWT authentication
router.use(verifyToken);

// GET /api/monthly-outcomes - Get all monthly outcomes
router.get('/', getAllMonthlyOutcomes);

// GET /api/monthly-outcomes/:id - Get single monthly outcome
router.get('/:id', getMonthlyOutcomeById);

// POST /api/monthly-outcomes - Create new monthly outcome
router.post('/', createMonthlyOutcome);

// PUT /api/monthly-outcomes/:id - Update monthly outcome
router.put('/:id', updateMonthlyOutcome);

// DELETE /api/monthly-outcomes/:id - Delete monthly outcome
router.delete('/:id', deleteMonthlyOutcome);

export default router;
