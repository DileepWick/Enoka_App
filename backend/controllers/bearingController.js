import Bearing from "../models/Bearing.js";
import Engine from "../models/Engine.js";
import Vendor from "../models/Vendor.js";

// Get all bearings
export const getAllBearings = async (req, res) => {
  try {
    const bearings = await Bearing.find()
      .populate("engine")
      .populate("vendor")
      .populate({
        path: "stock", // Populate the 'stock' array
        populate: {
          path: "branch", // Further populate the 'branch' field inside each stock
        },
      });
    res.json(bearings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create a new bearing
export const createBearing = async (req, res) => {
  try {
    const {
      part_number,
      type,
      brand,
      sizes,
      engine,
      vendor,
      added_by,
    } = req.body;

    // Check if a bearing with the same composite unique fields already exists
    const existingBearing = await Bearing.findOne({
      type,
      brand,
      sizes,
      engine,
      vendor,
    });

    if (existingBearing) {
      return res.status(409).json({
        error: `A bearing with the same type, brand, engine,size and vendor already exists.`,
      });
    }

    // Check if part number already exists, but only if part_number is provided
    if (part_number) {
      const existingPartNumber = await Bearing.findOne({ part_number });
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

    // Create a new bearing
    const bearing = new Bearing({
      part_number: part_number || undefined, // Only include part_number if provided
      type,
      sizes,
      brand,
      engine,
      vendor,
      added_by,
    });

    // Save the bearing to trigger post-save middleware
    const savedBearing = await bearing.save();

    // Return success response
    return res.status(201).json({
      message: "Bearing created successfully!",
      data: savedBearing,
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

// Delete a bearing
export const deleteBearing = async (req, res) => {
  try {
    const { id } = req.params;

    // Attempt to find and delete the bearing
    const bearing = await Bearing.findByIdAndDelete(id);

    // Check if bearing exists
    if (!bearing) {
      return res.status(404).json({ message: "Bearing not found" });
    }

    // Respond with success
    return res.status(200).json({ message: "Bearing successfully deleted" });
  } catch (err) {
    console.error(`Error deleting bearing: ${err.message}`); // Log error for debugging
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
