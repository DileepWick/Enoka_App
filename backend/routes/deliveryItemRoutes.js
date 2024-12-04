import express from 'express';
import { createDeliveryItem ,getAllDeliveryItems ,getDeliveryItemsByDeliveryId} from '../controllers/deliveryItemController.js';

const router = express.Router();

// Route to create a new delivery item
router.post('/createDeliveryItem', createDeliveryItem);
router.get('/', getAllDeliveryItems);
router.get('/getDeliveryItemsByDeliveryId/:deliveryId', getDeliveryItemsByDeliveryId);


export default router;
