import express from 'express';
import { updateStockQuantity ,increaseStockQuantity ,decreaseStockQuantity ,getAllStocks} from '../controllers/stockController.js';

const router = express.Router();

// Update stock quantity
router.put('/updateStockQuantity/:stockId', updateStockQuantity);

//Increase stock quantity
router.put('/increaseStockQuantity/:stockId', increaseStockQuantity);

//Decrease stock quantity
router.put('/decreaseStockQuantity/:stockId', decreaseStockQuantity);

//Get all stocks
router.get('/getAllStocks', getAllStocks);

export default router;