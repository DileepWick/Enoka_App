import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CashBillSchema = new Schema({
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"], // Add statuses as required
    default: "Pending",
  },
  createdDate: {
    type: Date,
    default: Date.now, // Automatically sets the current date
  },
  billType: {
    type: String,
    enum: ["E-Bill", "I-Bill"],
    default: "E-Bill",
  },
});

const CashBill = model("CashBill", CashBillSchema);

export default CashBill;
