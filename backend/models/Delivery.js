import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    senderBranch: {
      type: String,
      required: true,
    },
    receiverBranch: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "on delivery", "received", "cancelled"],
      default: "pending",
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    receivedAt: {
      type: Date,
    },
  },
  { timestamps: true } // Mongoose will automatically manage createdAt and updatedAt
);

// Middleware to update `updatedAt` when the status is changed or any field is modified
deliverySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  if (this.status === "received" && !this.receivedAt) {
    this.receivedAt = Date.now();
  }
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
