import express from 'express';
import {
  createDelivery,
  getDeliveryById,
  getAllDeliveries,
  updateDeliveryStatus,
  deleteDelivery,
  getOnDeliveryDeliveries,
  getLatestPendingDeliveries,
  getReceivedDelivery
} from '../controllers/deliveryController.js';

const router = express.Router();

// Create a new delivery
router.post('/', createDelivery);

// Update delivery status
router.put('/updateDeliveryStatus/:id', updateDeliveryStatus);

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

//Get on delivery deliveries
router.get('/deliveries/on-delivery', getOnDeliveryDeliveries);

//Get received deliveries
router.get('/deliveries/received', getReceivedDelivery);

export default router;
