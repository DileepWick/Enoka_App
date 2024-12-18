import DeliveryItem from "../models/deliveryItem.js";
import mongoose from "mongoose";

// Create a new delivery item
export const createDeliveryItem = async (req, res) => {
  const { item, quantity, deliveryId, stock } = req.body; // Destructure item, quantity, and deliveryId

  try {
    // Validate input
    if (!item || !quantity || !deliveryId || !stock) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if the delivery exists
    const delivery = await mongoose.model("Delivery").findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({
        message: "Delivery not found",
      });
    }

    // Check if the item has already been added to the delivery
    const existingItem = await mongoose.model("DeliveryItem").findOne({
      item,
      deliveryId,
    });

    if (existingItem) {
      return res.status(419).json({
        message: "Item has already been added to this delivery",
      });
    }

    // Map known models to item types (e.g., Gaskets, Pistons)
    const itemModels = {
      Gasket: "Gasket", // Replace with actual model names
      Piston: "Piston", // Replace with actual model names
      Razor: "Razor", // Replace with actual model names
    };

    let itemType = null;

    // Check if the item exists in any known model
    for (const [type, modelName] of Object.entries(itemModels)) {
      const model = mongoose.model(modelName);
      const itemDoc = await model.findById(item);

      if (itemDoc) {
        itemType = type; // Set the itemType based on the found model
        break;
      }
    }

    if (!itemType) {
      return res.status(400).json({
        message: "Item not found in any known collections",
      });
    }

    // Create a new delivery item with the correct itemType and deliveryId
    const newDeliveryItem = new DeliveryItem({
      item,
      itemType, // Dynamically set itemType
      quantity,
      deliveryId, // Set the deliveryId
      stock,
    });

    // Save the new delivery item
    await newDeliveryItem.save();

    res.status(201).json({
      message: "Delivery Item created successfully",
      deliveryItem: newDeliveryItem,
    });
  } catch (error) {
    console.error("Error creating delivery item:", error);
    res.status(500).json({
      message: "Error creating delivery item",
      error: error.message,
    });
  }
};

// Get all delivery items
export const getAllDeliveryItems = async (req, res) => {
  try {
    // Fetch all delivery items from the database and populate fields
    const deliveryItems = await DeliveryItem.find()
      .populate("item") // Populate the item reference
      .populate({
        path: "stock", // Populate the 'stock' array
        populate: {
          path: "branch", // Further populate the 'branch' field inside each stock
        },
      }) // Populate the stock reference
      .populate("deliveryId"); // Populate the delivery reference

    if (!deliveryItems || deliveryItems.length === 0) {
      return res.status(404).json({
        message: "No delivery items found",
      });
    }

    res.status(200).json({
      message: "Delivery items fetched successfully",
      deliveryItems,
    });
  } catch (error) {
    console.error("Error fetching delivery items:", error);
    res.status(500).json({
      message: "Error fetching delivery items",
      error: error.message,
    });
  }
};

//Get delivery items by deliveryId
export const getDeliveryItemsByDeliveryId = async (req, res) => {
  try {
    const { deliveryId } = req.params; // Get deliveryId from the URL parameter

    // Fetch all delivery items for the given deliveryId and populate the 'item' field
    const deliveryItems = await DeliveryItem.find({ deliveryId })
      .populate({
        path: "item", // Populate item
        populate: {
          path: "stock", // Populate stocks within item
          populate: {
            path: "branch", // Populate branch within stock
          },
        },
      })
      .populate({
        path: "stock", // Populate stock directly for DeliveryItem
        populate: {
          path: "branch", // Populate branch within stock
        },
      })
      .populate("deliveryId") // Populate deliveryId with all attributes
      .exec(); // Populate the delivery reference;

    if (!deliveryItems || deliveryItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No delivery items found for the given deliveryId",
      });
    }

    res.status(200).json({
      success: true,
      data: deliveryItems,
    });
  } catch (error) {
    console.error("Error fetching delivery items:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch delivery items",
      error: error.message,
    });
  }
};

//Edit delivery item quantity
export const editDeliveryItemQuantity = async (req, res) => {
  const { deliveryItemId } = req.params; // DeliveryItem ID
  const { quantity } = req.body;

  try {
    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    const deliveryItem = await DeliveryItem.findById(deliveryItemId);
    if (!deliveryItem) {
      return res.status(404).json({ message: "Delivery item not found." });
    }

    deliveryItem.quantity = quantity; // Update the quantity
    await deliveryItem.save(); // Save the updated delivery item

    res
      .status(200)
      .json({ message: "Quantity updated successfully.", deliveryItem });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating quantity.", error: error.message });
  }
};

// Delete delivery item
export const deleteDeliveryItem = async (req, res) => {
  const { deliveryItemId } = req.params; // DeliveryItem ID

  try {
    const deliveryItem = await DeliveryItem.findByIdAndDelete(deliveryItemId);

    if (!deliveryItem) {
      return res.status(404).json({ message: "Delivery item not found." });
    }

    res.status(200).json({ message: "Delivery item deleted successfully." });
  } catch (error) {
    // Ensure a proper error message is sent to the client
    console.error(error); // Logging error for server-side debugging
    res
      .status(500)
      .json({ message: "Error deleting delivery item.", error: error.message });
  }
};

// Update the status of a delivery item
export const updateStatusOfDeliveryItem = async (req, res) => {
  const { id } = req.params; // DeliveryItem ID from request parameters
  const { status } = req.body; // New status from request body

  try {
    // Find and update the delivery item by its ID
    const updatedItem = await DeliveryItem.findByIdAndUpdate(
      id,
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Delivery item not found" });
    }

    res.status(200).json({
      message: "Delivery item status updated successfully",
      updatedItem,
    });
  } catch (error) {
    console.error("Error updating delivery item status:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
