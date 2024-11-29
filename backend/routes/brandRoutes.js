import express from 'express';
import {
  getAllBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from '../controllers/brandController.js';

const router = express.Router();

// Fetch all brands
router.get('/', getAllBrands);

// Create a new brand
router.post('/', createBrand);

// Update a brand by ID
router.put('/:brand_id', updateBrand);

// Delete a brand by ID
router.delete('/:brand_id', deleteBrand);

export default router;
