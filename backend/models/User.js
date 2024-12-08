import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true, unique: true },
    uid: {
      type: String,
      required: true,
      unique: true, // Firebase User ID
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    telephone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "manager", "staff"], // Example roles
      default: "staff",
    },
    branchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    image: {
      type: String, // URL or file path for the user's image
    },
    active: {
      type: String,
      default: "0",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
