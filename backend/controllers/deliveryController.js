import Delivery from '../models/Delivery.js';

// Create a new delivery and return the newly created delivery info
export const createDelivery = async (req, res) => {
  try {
    const { senderBranch, receiverBranch } = req.body;

    const newDelivery = new Delivery({
      senderBranch,
      receiverBranch,
    });

    // Save the delivery
    await newDelivery.save();

    // Fetch the newly created delivery to return it in the response
    const createdDelivery = await Delivery.findById(newDelivery._id);

    res.status(201).json({ message: "Delivery created successfully", delivery: createdDelivery });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


// Get a delivery by ID
export const getDeliveryById = async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await Delivery.findById(id)
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching delivery', error });
  }
};

// Get all deliveries
export const getAllDeliveries = async (req, res) => {
  try {
    const deliveries = await Delivery.find()

    res.status(200).json(deliveries);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching deliveries', error });
  }
};

// Update delivery status
export const updateDeliveryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    if (!['on delivery', 'received', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    delivery.status = status;
    delivery.updatedAt = Date.now();
    await delivery.save();

    res.status(200).json(delivery);
  } catch (error) {
    res.status(500).json({ message: 'Error updating delivery status', error });
  }
};

// Delete a delivery
export const deleteDelivery = async (req, res) => {
  const { id } = req.params;

  try {
    const delivery = await Delivery.findByIdAndDelete(id);
    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    res.status(200).json({ message: 'Delivery deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting delivery', error });
  }
};


// Get the latest pending delivery
export const getLatestPendingDeliveries = async (req, res) => {
  try {
    // Fetch deliveries with status 'pending' sorted by creation date in descending order
    const pendingDeliveries = await Delivery.findOne({ status: "pending" })
      .sort({ createdAt: -1 }) // Sort by the latest created deliveries
      .exec();

    // Return the pending deliveries as JSON
    res.status(200).json({
      success: true,
      data: pendingDeliveries,
    });
  } catch (error) {
    // Handle any errors during the database operation
    console.error("Error fetching pending deliveries:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending deliveries.",
      error: error.message,
    });
  }
};