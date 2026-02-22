import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  getAllIncomes,
  getIncomeById,
  createIncome,
  updateIncome,
  deleteIncome
} from '../controllers/incomesController.js';

const router = express.Router();

// All routes require JWT authentication
router.use(verifyToken);

// GET /api/incomes - Get all incomes
router.get('/', getAllIncomes);

// GET /api/incomes/:id - Get single income
router.get('/:id', getIncomeById);

// POST /api/incomes - Create new income
router.post('/', createIncome);

// PUT /api/incomes/:id - Update income
router.put('/:id', updateIncome);

// DELETE /api/incomes/:id - Delete income
router.delete('/:id', deleteIncome);

export default router;
