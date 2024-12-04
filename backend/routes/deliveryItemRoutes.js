import express from 'express';
import { createDeliveryItem ,getAllDeliveryItems ,getDeliveryItemsByDeliveryId ,editDeliveryItemQuantity ,deleteDeliveryItem} from '../controllers/deliveryItemController.js';

const router = express.Router();

// Route to create a new delivery item
router.post('/createDeliveryItem', createDeliveryItem);
router.get('/', getAllDeliveryItems);
router.get('/getDeliveryItemsByDeliveryId/:deliveryId', getDeliveryItemsByDeliveryId);
router.put('/editDeliveryItemQuantity/:deliveryItemId', editDeliveryItemQuantity);
router.delete('/deleteDeliveryItem/:deliveryItemId', deleteDeliveryItem);


export default router;
