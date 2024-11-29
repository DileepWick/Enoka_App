import Vendor from '../models/Vendor.js';

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

// Get all vendors
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new vendor
export const createVendor = async (req, res) => {
  const { vendor_name } = req.body;

  try {
    const existingVendor = await Vendor.findOne({ vendor_name });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor name already exists." });
    }

    const vendor_id = generateCustomId('VEND-');
    const vendor = new Vendor({ vendor_id, vendor_name });
    const newVendor = await vendor.save();
    res.status(201).json(newVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a vendor by ID
export const updateVendor = async (req, res) => {
  const { vendor_id } = req.params;
  const { vendor_name } = req.body;

  try {
    const vendor = await Vendor.findOne({ vendor_id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    vendor.vendor_name = vendor_name;
    const updatedVendor = await vendor.save();
    res.json(updatedVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a vendor by ID
export const deleteVendor = async (req, res) => {
  const { vendor_id } = req.params;

  try {
    const vendor = await Vendor.findOneAndDelete({ vendor_id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found." });
    }

    res.json({ message: "Vendor deleted successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
