import DeliveryItem from '../models/deliveryItem.js';
import mongoose from 'mongoose';

export const createDeliveryItem = async (req, res) => {
  const { item, quantity, deliveryId } = req.body; // Destructure item, quantity, and deliveryId

  try {
    // Check if the delivery exists
    const delivery = await mongoose.model('Delivery').findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({
        message: 'Delivery not found'
      });
    }

    // Map known models to item types (e.g., Gaskets, Pistons)
    const itemModels = {
      Gasket: 'Gasket', // Replace with actual model names
      Piston: 'Piston', // Replace with actual model names
      Razor: 'Razor',   // Replace with actual model names
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
        message: 'Item not found in any known collections',
      });
    }

    // Create a new delivery item with the correct itemType and deliveryId
    const newDeliveryItem = new DeliveryItem({
      item,
      itemType, // Dynamically set itemType
      quantity,
      deliveryId, // Set the deliveryId
    });

    // Save the new delivery item
    await newDeliveryItem.save();

    res.status(201).json({
      message: 'Delivery Item created successfully',
      deliveryItem: newDeliveryItem,
    });
  } catch (error) {
    console.error('Error creating delivery item:', error);
    res.status(500).json({
      message: 'Error creating delivery item',
      error: error.message,
    });
  }
};


export const getAllDeliveryItems = async (req, res) => {
  try {
    // Fetch all delivery items from the database
    const deliveryItems = await DeliveryItem.find()
      .populate('item')  // Populate the item reference if needed
      .exec();

    if (!deliveryItems || deliveryItems.length === 0) {
      return res.status(404).json({
        message: 'No delivery items found'
      });
    }

    res.status(200).json({
      message: 'Delivery items fetched successfully',
      deliveryItems
    });
  } catch (error) {
    console.error('Error fetching delivery items:', error);
    res.status(500).json({
      message: 'Error fetching delivery items',
      error: error.message
    });
  }
};

export const getDeliveryItemsByDeliveryId = async (req, res) => {
  try {
    const { deliveryId } = req.params;  // Get deliveryId from the URL parameter

    // Fetch all delivery items for the given deliveryId and populate the 'item' field
    const deliveryItems = await DeliveryItem.find({ deliveryId })
      .populate('item') // Populate the item reference (this dynamically depends on the itemType)
      .exec();

    if (!deliveryItems || deliveryItems.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No delivery items found for the given deliveryId',
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