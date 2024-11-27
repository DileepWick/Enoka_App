import Brand from '../models/Brand.js';

export const getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.json(brands);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Utility function to generate custom IDs with prefix
const generateCustomId = (prefix) => `${prefix}${Math.random().toString(36).substr(2, 8).toUpperCase()}`;

export const createBrand = async (req, res) => {
  const { brand_name } = req.body;

  try {
    const brand_id = generateCustomId('BRND-');
    const brand = new Brand({ brand_id, brand_name });
    const newBrand = await brand.save();
    res.status(201).json(newBrand);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
