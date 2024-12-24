import express from 'express';
import {
  getAllVendors,
  createVendor,
  updateVendor,
  deleteVendor,
} from '../controllers/vendorController.js';

const router = express.Router();

router.get('/', getAllVendors);
router.post('/', createVendor);
router.put('/:vendor_id', updateVendor);
router.delete('/:vendor_id', deleteVendor);

export default router;
