import mongoose from "mongoose";
import Stock from "./Stock.js"; // Adjust path to your Stock model
import Branch from "./Branch.js"; // Adjust path to your Branch model

// Helper function to generate random ID with prefix
const generateId = (prefix) => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // Ensure 6 random characters
  return `${prefix}-${randomStr}`;
};

// Custom validation function for ID patterns
const validateIdPattern = (id, prefix) => {
  const regex = new RegExp(`^${prefix}-[A-Z0-9]{6}$`); // Match the format "PREFIX-XXXXXX"
  return regex.test(id);
};

const ringsSchema = new mongoose.Schema({
  ring_id: {
    type: String,
    required: true,
    unique: true,
    default: () => generateId("RNG"), // Automatically generate ring ID
    validate: {
      validator: (v) => validateIdPattern(v, "RNG"),
      message: (props) => `${props.value} is not a valid ring ID!`,
    },
  },
  part_number: {
    type: String,
    default: "Unspecified",
    trim: true,
  },
  sizes: {
    type: String,
    required: [true, "Size is required"],
    enum: ["STD", "25", "50", "75", "100"],
    trim: true,
  },
  brand: {
    type: String,
    required: [true, "Brand is required"],
    enum: ["NPR", "RIK", "GENUINE"],
    trim: true,
  },
  engine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Engine",
    required: true,
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vendor",
    required: true,
  },
  stock: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stock",
    },
  ],
  added_by: {
    type: String,
    default: "Admin",
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
});

// Add a unique composite index to enforce the uniqueness constraint
ringsSchema.index(
  {
    sizes: 1,
    brand: 1,
    engine: 1,
    vendor: 1,
    part_number: 1, // Include part_number in the composite index
  },
  {
    unique: true,
    partialFilterExpression: {
      sizes: { $exists: true },
      part_number: { $ne: "Unspecified" }, // Ensure part_number is not "Unspecified"
    },
  }
);

// Middleware to create stocks for all branches on ring creation
ringsSchema.post("save", async function (doc, next) {
  try {
    // Check if stocks are already created for this ring
    if (doc.stock && doc.stock.length > 0) {
      return next(); // Skip stock creation if stocks are already associated
    }

    // Fetch all branches
    const branches = await Branch.find({});
    if (!branches.length) return next(); // Skip if no branches found

    // Create stock for each branch
    const stockEntries = branches.map((branch) => ({
      branch: branch._id,
      item: doc._id, // Associate the ring with the stock
      itemModel: "Ring", // Specify the item type as 'Ring'
      quantity: 100, // Default quantity for new ring
      updated_by: doc.added_by, // Use the ring's "added_by" field
    }));

    // Insert stocks and update the ring
    const createdStocks = await Stock.insertMany(stockEntries);
    doc.stock = createdStocks.map((stock) => stock._id);

    // Update ring without triggering middleware
    await this.constructor.updateOne({ _id: doc._id }, { stock: doc.stock });

    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

export default mongoose.model("Ring", ringsSchema);
