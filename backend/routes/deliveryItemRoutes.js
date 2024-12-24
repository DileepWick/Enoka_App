import express from "express";
import {
  createDeliveryItem,
  getAllDeliveryItems,
  getDeliveryItemsByDeliveryId,
  editDeliveryItemQuantity,
  deleteDeliveryItem,
  updateStatusOfDeliveryItem,
  updateStockForBranchAndItem,
  setReceivedQuantity,
  setReturnedQuantity
} from "../controllers/deliveryItemController.js";

const router = express.Router();

// Route to create a new delivery item
router.post("/createDeliveryItem", createDeliveryItem);
router.get("/", getAllDeliveryItems);


router.get(
  "/getDeliveryItemsByDeliveryId/:deliveryId",
  getDeliveryItemsByDeliveryId
);


router.put(
  "/editDeliveryItemQuantity/:deliveryItemId",
  editDeliveryItemQuantity
);
router.delete("/deleteDeliveryItem/:deliveryItemId", deleteDeliveryItem);
router.put("/updateStatusOfDeliveryItem/:id", updateStatusOfDeliveryItem);
router.put("/updateStockForBranchAndItem", updateStockForBranchAndItem);

router.put("/setReceivedQuantity", setReceivedQuantity);
router.put("/setReturnedQuantity", setReturnedQuantity);

export default router;
