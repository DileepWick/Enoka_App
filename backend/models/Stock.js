import mongoose from "mongoose";

// Stocks Schema
const StocksSchema = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Branch schema
        ref: "Branch", // Model name of the referenced schema
        required: true, // Ensure a branch is always associated with the stock
    },
    quantity: {
        type: Number,
        required: true, // Quantity is required
        min: [0, "Quantity cannot be negative"], // Validation to ensure non-negative quantity
        default: 100000, // Default quantity value
    },
    updated_by: {
        type: String,
        default: "This stock is not evaluated", // Who updated the stock is required
    },
    latest_update_date: {
        type: Date,
        default: Date.now, // Automatically sets the latest update date
    },
});

const Stock = mongoose.model("Stock", StocksSchema);

export default Stock;
