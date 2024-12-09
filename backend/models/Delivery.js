import mongoose from "mongoose";


// Function to generate a unique delivery ID
const generateDeliveryId = async () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000); // Generate a 4-digit random number
  const deliveryId = `DL${randomNumber}`;

  // Ensure the generated ID is unique
  const existingDelivery = await Delivery.findOne({ deliveryId });
  if (existingDelivery) {
    return await generateDeliveryId(); // Retry if the ID already exists
  }

  return deliveryId;
};

const deliverySchema = new mongoose.Schema(
  {
    deliveryId: {
      type: String,
      unique: true,
    },
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

// Middleware to assign a unique delivery ID before saving
deliverySchema.pre('save', async function (next) {
  if (!this.deliveryId) {
    this.deliveryId = await generateDeliveryId();
  }
  this.updatedAt = Date.now();

  if (this.status === "received" && !this.receivedAt) {
    this.receivedAt = Date.now();
  }
  next();
});

const Delivery = mongoose.model("Delivery", deliverySchema);
export default Delivery;
