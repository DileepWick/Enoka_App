import DeliveryList from "../models/Delivery_List.js";  // Corrected to DeliveryList


import Gasket from "../models/Gasket.js";  // Assuming Gasket model is imported

// Helper to validate gasket items in the delivery list
const validateGaskets = async (items) => {
  // Validate if Gasket items exist in the database
  for (const item of items) {
    if (item.item_type !== 'Gasket') {
      throw new Error(`Invalid item type: ${item.item_type}`);
    }
    const gasketExists = await Gasket.findById(item.item_id);
    if (!gasketExists) {
      throw new Error(`Gasket with ID ${item.item_id} does not exist`);
    }
  }
};

// Create a new delivery
export const createDelivery = async (req, res) => {
  try {
    const { items, branch_from, branch_to, due_arrival } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Delivery must include at least one item" });
    }

    // Validate the items (only Gaskets for now)
    await validateGaskets(items);

    const newDelivery = new DeliveryList({
      items,
      branch_from,
      branch_to,
      due_arrival,
    });

    const savedDelivery = await newDelivery.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await DeliveryList.find()
      .populate("items.item_id") // Populate items dynamically based on `refPath`
      .exec();
    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single delivery by ID
export const getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryList.findById(id)
      .populate("items.item_id")  // Populate items dynamically
      .exec();

    if (!delivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a delivery
export const updateDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const { items, branch_from, branch_to, status, due_arrival } = req.body;

    if (items) {
      // Validate items (only Gaskets for now)
      await validateGaskets(items);
    }

    const updatedDelivery = await DeliveryList.findByIdAndUpdate(
      id,
      { items, branch_from, branch_to, status, due_arrival },
      { new: true, runValidators: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a delivery
export const deleteDelivery = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDelivery = await DeliveryList.findByIdAndDelete(id);

    if (!deletedDelivery) {
      return res.status(404).json({ error: "Delivery not found" });
    }

    res.status(200).json({ message: "Delivery deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
