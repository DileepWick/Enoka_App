import mongoose from 'mongoose';

const VendorSchema = new mongoose.Schema({
  vendor_id: { type: String, required: true, unique: true },
  vendor_name: { type: String, required: true },
});

const Vendor = mongoose.model('Vendor', VendorSchema);
export default Vendor;
