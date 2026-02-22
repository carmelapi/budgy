import express from 'express';
import verifyToken from '../../middleware/verifyToken.js';
import {
  getAllFixedCosts,
  getFixedCostById,
  createFixedCost,
  updateFixedCost,
  deleteFixedCost
} from './fixed-costs.controller.js';

const router = express.Router();

// All routes require JWT authentication
router.use(verifyToken);

// GET /api/fixed-costs - Get all fixed costs
router.get('/', getAllFixedCosts);

// GET /api/fixed-costs/:id - Get single fixed cost
router.get('/:id', getFixedCostById);

// POST /api/fixed-costs - Create new fixed cost
router.post('/', createFixedCost);

// PUT /api/fixed-costs/:id - Update fixed cost
router.put('/:id', updateFixedCost);

// DELETE /api/fixed-costs/:id - Delete fixed cost
router.delete('/:id', deleteFixedCost);

export default router;
