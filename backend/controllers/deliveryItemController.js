import DeliveryItem from "../models/deliveryItem.js";
import mongoose from "mongoose";

import Stock from "../models/Stock.js";
import Branch from "../models/Branch.js";

// Import item models
import Ring from "../models/Ring.js";
import Gasket from "../models/Gasket.js";
import Bearing from "../models/Bearing.js";

// Create a new delivery item
export const createDeliveryItem = async (req, res) => {
  const { item, delivery_quantity, deliveryId, stock } = req.body; // Destructure item, quantity, and deliveryId

  try {
    // Validate input
    if (!item || !delivery_quantity || !deliveryId || !stock) {
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
      Gasket: "Gasket",
      Ring: "Ring",
      Bearing: "Bearing",
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
      delivery_quantity,
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

//Set received quantity
export const setReceivedQuantity = async (req, res) => {
  const { deliveryItemId, received_quantity } = req.body; // Destructure item, quantity, and deliveryId

  try {
    // Validate input
    if (!deliveryItemId || !received_quantity) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if the delivery item exists
    const deliveryItem = await mongoose
      .model("DeliveryItem")
      .findById(deliveryItemId);
    if (!deliveryItem) {
      return res.status(404).json({
        message: "Delivery item not found",
      });
    }

    //Use find by id and update
    const updatedDeliveryItem = await mongoose
      .model("DeliveryItem")
      .findOneAndUpdate(
        { _id: deliveryItemId },
        { received_quantity }, // Only update received_quantity
        { new: true }
      );

    res.status(200).json({
      message: "Received quantity updated successfully",
      updatedDeliveryItem,
    });
  } catch (error) {
    console.error("Error updating received quantity:", error);
    res.status(500).json({
      message: "Error updating received quantity",
      error: error.message,
    });
  }
};

//Set returned quantity
export const setReturnedQuantity = async (req, res) => {
  const { deliveryItemId, returned_quantity } = req.body;

  try {
    // Validate input
    if (!deliveryItemId || returned_quantity === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    // Check if the delivery item exists
    const deliveryItem = await mongoose
      .model("DeliveryItem")
      .findById(deliveryItemId);

    if (!deliveryItem) {
      return res.status(404).json({
        message: "Delivery item not found",
      });
    }

    // Update the returned quantity directly
    const updatedDeliveryItem = await mongoose
      .model("DeliveryItem")
      .findOneAndUpdate(
        { _id: deliveryItemId },
        { returned_quantity }, // Only update returned_quantity
        { new: true } // Return the updated document
      );

    res.status(200).json({
      message: "Returned quantity updated successfully",
      deliveryItem: updatedDeliveryItem,
    });
  } catch (error) {
    console.error("Error updating returned quantity:", error);
    res.status(500).json({
      message: "Error updating returned quantity",
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
        populate: [
          {
            path: "stock", // Populate stocks within item
            populate: {
              path: "branch", // Populate branch within stock
            },
          },
          {
            path: "brand", // Populate brand within item
          },
          {
            path: "engine", // Populate engine within item
          },
          {
            path: "vendor", // Populate vendor within item
          },
        ],
      })
      .populate({
        path: "stock", // Populate stock directly for DeliveryItem
        populate: {
          path: "branch", // Populate branch within stock
        },
      })
      .populate("deliveryId") // Populate deliveryId with all attributes
      .exec();

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
  const { delivery_quantity } = req.body;

  try {
    if (delivery_quantity < 1) {
      return res
        .status(400)
        .json({ message: "Delivery_quantity must be at least 1." });
    }

    const deliveryItem = await DeliveryItem.findById(deliveryItemId);
    if (!deliveryItem) {
      return res.status(404).json({ message: "Delivery item not found." });
    }

    deliveryItem.delivery_quantity = delivery_quantity; // Update the quantity
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

// Controller function to find and update stock - Gasket Only
export const updateStockForBranchAndItem = async (req, res) => {
  try {
    const { branchName, itemId, quantity, itemType } = req.body; // Get the branch name, item ID, quantity, and item type from the request

    // Find the branch by name
    const branch = await Branch.findOne({ name: branchName });
    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Determine whether it's a Gasket or Ring and find the item accordingly
    let item;
    if (itemType === "Gasket") {
      item = await Gasket.findById(itemId);
      if (!item) {
        return res.status(404).json({ message: "Item (Gasket) not found" });
      }
    } else if (itemType === "Ring") {
      item = await Ring.findById(itemId); // Assuming you have a Ring model for Ring items
      if (!item) {
        return res.status(404).json({ message: "Item (Ring) not found" });
      }
    } else if (itemType === "Bearing") {
      item = await Bearing.findById(itemId); // Assuming you have a Bearing model for Bearing items
      if (!item) {
        return res.status(404).json({ message: "Item (Bearing) not found" });
      }
    } else {
      return res.status(400).json({ message: "Invalid item type" });
    }

    // Find the stock associated with the branch and item (either Gasket or Ring)
    const stock = await Stock.findOne({
      branch: branch._id,
      _id: { $in: item.stock }, // Assuming both Gaskets and Rings have a `stock` field
    });

    if (!stock) {
      return res
        .status(404)
        .json({ message: "Stock not found for this branch and item" });
    }

    // Update the stock quantity
    stock.quantity += quantity; // Add the quantity (could be positive or negative based on the operation)

    // Save the updated stock
    await stock.save();

    return res
      .status(200)
      .json({ message: "Stock updated successfully", stock });
  } catch (error) {
    console.error("Error updating stock:", error);
    res
      .status(500)
      .json({ message: "Error updating stock", error: error.message });
  }
};
