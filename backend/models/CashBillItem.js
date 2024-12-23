import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CashBillItemSchema = new Schema({
  cashBill: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CashBill", // Reference to the CashBill model
    required: true,  // Ensuring that every CashBillItem must be associated with a CashBill
  },
  stock: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Stock", // Reference to the Stock model
    required: true,  // Every CashBillItem is linked to a specific Stock item
  },
  unitPrice: {
    type: Number,
    required: true,  // The unit price must be provided
  },
  discount: {
    type: Number,
    default: 0,  // Default discount is 0 if not provided
  },
  quantity: {
    type: Number,
    required: true,  // Quantity must be provided
    min: 1,  // The quantity must be at least 1
  },
  total: {
    type: Number,
    required: true,  // Total is required and will be calculated based on quantity, unit price, and discount
  },
  status: {
    type: String,
    enum: ["Pending", "Completed", "Returned"], // Possible statuses
    default: "Pending", // Default status is "Pending"
  },
});

// Pre-save middleware to calculate the total for the CashBillItem
CashBillItemSchema.pre("save", function (next) {
  this.total = (this.unitPrice - this.discount) * this.quantity;
  next();
});

const CashBillItem = model("CashBillItem", CashBillItemSchema);

export default CashBillItem;
