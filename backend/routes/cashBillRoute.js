import express from "express";
import { createCashBill,deleteCashBill,getLatestPendingCashBill, updateCashBillStatus } from "../controllers/cashBillController.js";

const router = express.Router();

router.post("/createCashBill", createCashBill);
router.delete("/deleteCashBill/:id", deleteCashBill);
router.get("/getLatestPendingCashBill", getLatestPendingCashBill);
router.put("/updateCashBillStatus", updateCashBillStatus);

export default router;