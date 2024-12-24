import mongoose from "mongoose";


// Define the StocksSchema
const StocksSchema = new mongoose.Schema({
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Quantity cannot be negative"],
      default: 100000,
    },
    updated_by: {
      type: String,
      default: "This stock is not evaluated",
    },
    latest_update_date: {
      type: Date,
      default: Date.now,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "itemModel", // Dynamically reference based on itemModel
    },
    itemModel: {
      type: String,
      required: true,
      enum: ["Gasket", "Piston", "Bearing", "Razor","Ring"], // Allowed item models
    },
  });

// Create the Stock model
const Stock = mongoose.model("Stock", StocksSchema);

export default Stock;
