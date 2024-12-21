import mongoose from "mongoose";

const { Schema, model } = mongoose;

const CashBillSchema = new Schema({
  status: {
    type: String,
    enum: ["Pending", "Completed", "Cancelled"],
    default: "Pending",
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  billType: {
    type: String,
    enum: ["E-Bill", "I-Bill"],
    default: "E-Bill",
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const CashBill = model("CashBill", CashBillSchema);

export default CashBill;
