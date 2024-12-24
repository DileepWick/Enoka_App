import express from "express";
import {
  updateStockQuantity,
  increaseStockQuantity,
  decreaseStockQuantity,
  getAllStocks,
  getAllStocksForGasket,
  getAllStocksForRing
} from "../controllers/stockController.js";

const router = express.Router();

// Update stock quantity
router.put("/updateStockQuantity/:stockId", updateStockQuantity);

//Increase stock quantity
router.put("/increaseStockQuantity/:stockId", increaseStockQuantity);

//Decrease stock quantity
router.put("/decreaseStockQuantity/:stockId", decreaseStockQuantity);

//Get all stocks for gasket
router.get("/getAllStocksForGasket", getAllStocksForGasket);

//Get all stocks for ring
router.get("/getAllStocksForRing", getAllStocksForRing);

//Get all stocks
router.get("/getAllStocks", getAllStocks);

export default router;
