import express from 'express';
import { getAllBrands, createBrand } from '../controllers/brandController.js';

const router = express.Router();

router.get('/', getAllBrands);
router.post('/', createBrand);

export default router;
