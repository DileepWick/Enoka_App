import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema(
  {
    vendor_id: { type: String, required: true, unique: true },
    vendor_name: { type: String, required: true, unique: true },
  },
  {
    collation: { locale: "en", strength: 2 }, // Ensures case-insensitive uniqueness
  }
);

// Pre-save hook to capitalize the first letter
VendorSchema.pre("save", function (next) {
  if (this.vendor_name) {
    this.vendor_name = this.vendor_name
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
  }
  next();
});

const Vendor = mongoose.model("Vendor", VendorSchema);

export default Vendor;
