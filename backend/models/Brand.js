import mongoose from "mongoose";

const BrandSchema = new mongoose.Schema(
  {
    brand_id: { type: String, required: true, unique: true },
    brand_name: { type: String, required: true, unique: true },
  },
  {
    collation: { locale: "en", strength: 2 }, // Ensures case-insensitive uniqueness
  }
);

// Pre-save hook to capitalize the first letter
BrandSchema.pre("save", function (next) {
  if (this.brand_name) {
    this.brand_name = this.brand_name
      .toLowerCase()
      .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize the first letter
  }
  next();
});

const Brand = mongoose.model("Brand", BrandSchema);

export default Brand;
