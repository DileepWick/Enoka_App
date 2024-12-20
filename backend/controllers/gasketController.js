import Gasket from "../models/Gasket.js";
import Engine from "../models/Engine.js";
import Brand from "../models/Brand.js";
import Vendor from "../models/Vendor.js";

// Get all gaskets
export const getAllGaskets = async (req, res) => {
  try {
    const gaskets = await Gasket.find()
    .populate("engine")
    .populate("brand")
    .populate("vendor")
    .populate({
      path: "stock", // Populate the 'stock' array
      populate: {
        path: "branch", // Further populate the 'branch' field inside each stock
      },
    });
    res.json(gaskets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new gasket
export const createGasket = async (req, res) => {
  try {
    const {
      part_number,
      material_type,
      packing_type,
      engine,
      brand,
      vendor,
      added_by,
    } = req.body;

    // Check if a gasket with the same composite unique fields already exists
    const existingGasket = await Gasket.findOne({
      material_type,
      packing_type,
      engine,
      brand,
      vendor,
    });

    if (existingGasket) {
      return res.status(409).json({
        error: `A gasket with the same material type, packing type, engine, brand, and vendor already exists.`,
      });
    }

    // Check if part number already exists, but only if part_number is provided
    if (part_number) {
      const existingPartNumber = await Gasket.findOne({ part_number });
      if (existingPartNumber) {
        return res.status(409).json({
          error: `Part number ${part_number} already exists.`,
        });
      }
    }

    // Validate references (Vendor, Engine, and Brand)
    const [vendorExists, engineExists, brandExists] = await Promise.all([
      Vendor.findById(vendor),
      Engine.findById(engine),
      Brand.findById(brand),
    ]);

    if (!vendorExists) {
      return res
        .status(400)
        .json({ error: `Vendor with ID ${vendor} does not exist.` });
    }

    if (!engineExists) {
      return res
        .status(400)
        .json({ error: `Engine with ID ${engine} does not exist.` });
    }

    if (!brandExists) {
      return res
        .status(400)
        .json({ error: `Brand with ID ${brand} does not exist.` });
    }

    // Create a new gasket
    const gasket = new Gasket({
      part_number: part_number || undefined, // Only include part_number if provided
      material_type,
      packing_type,
      engine,
      brand,
      vendor,
      added_by,
    });

    // Save the gasket to trigger post-save middleware
    const savedGasket = await gasket.save();

    // Return success response
    return res.status(201).json({
      message: "Gasket created successfully!",
      data: savedGasket,
    });
  } catch (error) {
    console.error(error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    // Handle duplicate key errors (e.g., composite index violations)
    if (error.code === 11000) {
      return res.status(409).json({
        error: "A duplicate entry exists for the provided fields.",
      });
    }

    // Handle other errors
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


// Update a gasket
export const updateGasket = async (req, res) => {
  try {
    const updatedGasket = await Gasket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedGasket);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a gasket
export const deleteGasket = async (req, res) => {
  try {
    await Gasket.findByIdAndDelete(req.params.id);
    res.json({ message: "Gasket deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//Increase Quantity
export const increaseGasketQuantity = async (req, res) => {
  const { id } = req.params; // Gasket ID from request params
  const { quantity } = req.body; // Quantity to add from request body

  if (!quantity || isNaN(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Invalid quantity. Please provide a positive number.",
    });
  }

  try {
    // Find the gasket by ID
    const gasket = await Gasket.findById(id);

    if (!gasket) {
      return res.status(404).json({
        success: false,
        message: `Gasket with ID ${id} not found.`,
      });
    }

    // Increase the stock
    gasket.stock += Number(quantity);

    // Save the updated gasket
    await gasket.save();

    res.status(200).json({
      success: true,
      message: `Stock increased by ${quantity} for gasket ID ${id}.`,
      data: gasket,
    });
  } catch (error) {
    console.error("Error increasing gasket quantity:", error.message);
    res.status(500).json({
      success: false,
      message: "An error occurred while updating the gasket stock.",
    });
  }
};
