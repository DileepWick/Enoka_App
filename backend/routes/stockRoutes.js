import express from 'express';
import { updateStockQuantity } from '../controllers/stockController.js';

const router = express.Router();

// Update stock quantity
router.put('/updateStockQuantity/:stockId', updateStockQuantity);

export default router;