import express from 'express';
import {
  getAllGaskets,
  createGasket,
  updateGasket,
  deleteGasket,
  increaseGasketQuantity
} from '../controllers/gasketController.js';

const router = express.Router();

// Get all gaskets
router.get('/', getAllGaskets);

// Create a new gasket
router.post('/', createGasket);

// Update a gasket
router.put('/:id', updateGasket);

// Delete a gasket
router.delete('/:id', deleteGasket);

// Increase Gasket Quantity
router.put('/increaseGasketQty/:id', increaseGasketQuantity);

export default router;
