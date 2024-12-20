import express from 'express';
import {
    createCashBillItem,
    getAllCashBillItems,
    deleteCashBillItem,
    updateCashBillItem,
    returnCashBillItem
} from '../controllers/cash_bill_item_controller.js';

const router = express.Router();

router.post('/createCashBillItem', createCashBillItem);
router.get('/getAllCashBillItems/:cashBillId', getAllCashBillItems);
router.delete('/deleteCashBillItem/:cashBillItemId', deleteCashBillItem);
router.put('/updateCashBillItem/:cashBillItemId', updateCashBillItem);
router.put('/returnCashBillItem/:cashBillItemId', returnCashBillItem);

export default router;