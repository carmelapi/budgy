import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getMonthlyBalance
} from '../controllers/transactionController.js';

const router = express.Router();

// All routes require JWT authentication
router.use(verifyToken);

// GET /api/transactions/balance/monthly - Must come BEFORE /:id route
router.get('/balance/monthly', getMonthlyBalance);

// GET /api/transactions - Get all transactions with optional filters
router.get('/', getAllTransactions);

// GET /api/transactions/:id - Get single transaction
router.get('/:id', getTransactionById);

// POST /api/transactions - Create new transaction
router.post('/', createTransaction);

// PUT /api/transactions/:id - Update transaction
router.put('/:id', updateTransaction);

// DELETE /api/transactions/:id - Delete transaction
router.delete('/:id', deleteTransaction);

export default router;
