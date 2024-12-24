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

const bearingsSchema = new mongoose.Schema({
  bearing_id: {
    type: String,
    required: true,
    unique: true,
    default: () => generateId("BRG"), // Automatically generate bearing ID
    validate: {
      validator: (v) => validateIdPattern(v, "BRG"),
      message: (props) => `${props.value} is not a valid bearing ID!`,
    },
  },
  part_number: {
    type: String,
    default: "Unspecified",
    trim: true,
  },
  type: {
    type: String,
    required: [true, "Type is required"],
    enum: ["MAIN", "CAM", "THRUST", "PIN BUSH","OTHER"],
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
    enum: ["TAIHO", "DAIDO", "NDC", "OTHER"],
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
bearingsSchema.index(
  {
    type: 1,
    brand: 1,
    engine: 1,
    vendor: 1,
    part_number: 1, // Include part_number in the composite index
  },
  {
    unique: true,
    partialFilterExpression: {
      part_number: { $ne: "Unspecified" }, // Ensure part_number is not "Unspecified"
    },
  }
);

// Middleware to create stocks for all branches on bearing creation
bearingsSchema.post("save", async function (doc, next) {
  try {
    // Check if stocks are already created for this bearing
    if (doc.stock && doc.stock.length > 0) {
      return next(); // Skip stock creation if stocks are already associated
    }

    // Fetch all branches
    const branches = await Branch.find({});
    if (!branches.length) return next(); // Skip if no branches found

    // Create stock for each branch
    const stockEntries = branches.map((branch) => ({
      branch: branch._id,
      item: doc._id, // Associate the bearing with the stock
      itemModel: "Bearing", // Specify the item type as 'Bearing'
      quantity: 100, // Default quantity for new bearing
      updated_by: doc.added_by, // Use the bearing's "added_by" field
    }));

    // Insert stocks and update the bearing
    const createdStocks = await Stock.insertMany(stockEntries);
    doc.stock = createdStocks.map((stock) => stock._id);

    // Update bearing without triggering middleware
    await this.constructor.updateOne({ _id: doc._id }, { stock: doc.stock });

    next();
  } catch (error) {
    next(error); // Pass any error to the next middleware
  }
});

export default mongoose.model("Bearing", bearingsSchema);
