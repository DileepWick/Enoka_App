import express from 'express';
import {
  createDelivery,
  getDeliveryById,
  getAllDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
  getLatestPendingDeliveries
} from '../controllers/deliveryController.js';

const router = express.Router();

// Create a new delivery
router.post('/', createDelivery);

// Get a specific delivery by ID
router.get('/:id', getDeliveryById);

// Get all deliveries
router.get('/', getAllDeliveries);

// Update delivery status
router.put('/:id/status', updateDeliveryStatus);

// Delete a delivery
router.delete('/:id', deleteDelivery);

//Get latest pending delivery
router.get('/deliveries/latest', getLatestPendingDeliveries);

export default router;
