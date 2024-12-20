import express from "express";
import { createCashBill,deleteCashBill,getLatestPendingCashBill } from "../controllers/cashBillController.js";

const router = express.Router();

router.post("/createCashBill", createCashBill);
router.delete("/deleteCashBill/:id", deleteCashBill);
router.get("/getLatestPendingCashBill", getLatestPendingCashBill);

export default router;