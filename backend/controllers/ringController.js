import Ring from "../models/Ring.js";
import Engine from "../models/Engine.js";
import Vendor from "../models/Vendor.js";

// Get all rings
export const getAllRings = async (req, res) => {
  try {
    const rings = await Ring.find()
      .populate("engine")
      .populate("vendor")
      .populate({
        path: "stock", // Populate the 'stock' array
        populate: {
          path: "branch", // Further populate the 'branch' field inside each stock
        },
      });
    res.json(rings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new ring
export const createRing = async (req, res) => {
  try {
    const {
      part_number,
      sizes,
      brand,
      engine,
      vendor,
      added_by,
    } = req.body;

    // Check if a ring with the same composite unique fields already exists
    const existingRing = await Ring.findOne({
      sizes,
      brand,
      engine,
      vendor,
    });

    if (existingRing) {
      return res.status(409).json({
        error: `A ring with the same size, brand, engine, and vendor already exists.`,
      });
    }

    // Check if part number already exists, but only if part_number is provided
    if (part_number) {
      const existingPartNumber = await Ring.findOne({ part_number });
      if (existingPartNumber) {
        return res.status(409).json({
          error: `Part number ${part_number} already exists.`,
        });
      }
    }

    // Validate references (Vendor and Engine)
    const [vendorExists, engineExists] = await Promise.all([
      Vendor.findById(vendor),
      Engine.findById(engine),
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

    // Create a new ring
    const ring = new Ring({
      part_number: part_number || undefined, // Only include part_number if provided
      sizes,
      brand,
      engine,
      vendor,
      added_by,
    });

    // Save the ring to trigger post-save middleware
    const savedRing = await ring.save();

    // Return success response
    return res.status(201).json({
      message: "Ring created successfully!",
      data: savedRing,
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

// Delete a ring
export const deleteRing = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the ring
    const ring = await Ring.findByIdAndDelete(id);

    // Check if ring exists
    if (!ring) {
      return res.status(404).json({ message: "Ring not found" });
    }

    // Respond with success
    return res.status(200).json({ message: "Ring successfully deleted" });
  } catch (err) {
    console.error(`Error deleting ring: ${err.message}`); // Log error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};