import express from 'express';
import { getAllVendors, createVendor } from '../controllers/vendorController.js';

const router = express.Router();

router.get('/', getAllVendors);
router.post('/', createVendor);

export default router;
