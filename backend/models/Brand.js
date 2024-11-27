import mongoose from 'mongoose';

const BrandSchema = new mongoose.Schema({
  brand_id: { type: String, required: true, unique: true },
  brand_name: { type: String, required: true },
});

const Brand = mongoose.model('Brand', BrandSchema);
export default Brand;
