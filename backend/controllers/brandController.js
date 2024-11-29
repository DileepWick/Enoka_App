import Brand from '../models/Brand.js';

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

// Get all brands
export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new brand
export const createBrand = async (req, res) => {
  const { brand_name } = req.body;

  try {
    // Check if brand_name already exists
    const existingBrand = await Brand.findOne({ brand_name });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand name already exists" });
    }

    // Generate a custom ID and create a new brand
    const brand_id = generateCustomId('BRND-');
    const brand = new Brand({ brand_id, brand_name });
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a brand
export const updateBrand = async (req, res) => {
  const { brand_id } = req.params;
  const { brand_name } = req.body;

  try {
    // Check if the new brand_name already exists (excluding the current brand)
    const existingBrand = await Brand.findOne({ brand_name, brand_id: { $ne: brand_id } });
    if (existingBrand) {
      return res.status(400).json({ message: "Brand name already exists" });
    }

    // Update the brand
    const updatedBrand = await Brand.findOneAndUpdate(
      { brand_id },
      { brand_name },
      { new: true }
    );

    if (!updatedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json(updatedBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a brand
export const deleteBrand = async (req, res) => {
  const { brand_id } = req.params;

  try {
    const deletedBrand = await Brand.findOneAndDelete({ brand_id });

    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }

    res.json({ message: "Brand deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
