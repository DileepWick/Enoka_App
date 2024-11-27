import Vendor from '../models/Vendor.js';

export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json(vendors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

export const createVendor = async (req, res) => {
  const { vendor_name } = req.body;

  try {
    const vendor_id = generateCustomId('VEND-');
    const vendor = new Vendor({ vendor_id, vendor_name });
    const newVendor = await vendor.save();
    res.status(201).json(newVendor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};