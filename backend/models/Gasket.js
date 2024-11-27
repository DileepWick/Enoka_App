import mongoose from 'mongoose';

// Helper function to generate random ID with prefix
const generateId = (prefix) => {
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase(); // Ensure 6 random characters
  return `${prefix}-${randomStr}`;
};

// Custom validation function for ID patterns
const validateIdPattern = (id, prefix) => {
  const regex = new RegExp(`^${prefix}-[A-Z0-9]{6}$`); // Match the format "PREFIX-XXXXXX"
  return regex.test(id);
};

const gasketSchema = new mongoose.Schema({
  gasket_id: {
    type: String,
    required: true,
    unique: true,
    default: () => generateId('GSKT'), // Automatically generate gasket ID
    validate: {
      validator: (v) => validateIdPattern(v, 'GSKT'),
      message: (props) => `${props.value} is not a valid gasket ID!`
    }
  },
  part_number: {
    type: String,
    required: [true, 'Part number is required'], // Add custom error message
    trim: true // Remove unnecessary spaces
  },
  material_type: {
    type: String,
    required: [true, 'Material type is required'],
    enum: ['Metal', 'Rubber', 'Composite'], // Add predefined material types
    trim: true
  },
  packing_type: {
    type: String,
    required: [true, 'Packing type is required'],
    trim: true
  },
  engine_id: {
    type: String,
    required: true,
  },
  brand_id: {
    type: String,
    required: true,
  },
  vendor_id: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters'] // Add limit to description length
  },
  stock: {
    type: Number,
    required: [true, 'Stock value is required'],
    min: [0, 'Stock cannot be negative'] // Ensure stock is non-negative
  },
  minstock: {
    type: Number,
    required: [true, 'Minimum stock value is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  barcode: {
    type: String,
    required: [true, 'Barcode is required'],
    unique: true, // Barcodes should be unique
    default: () => generateId('BAR'), // Automatically generate barcode
    validate: {
      validator: (v) => validateIdPattern(v, 'BAR'),
      message: (props) => `${props.value} is not a valid barcode!`
    },
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear(), 'Year cannot be in the future'] // Validate against the current year
  },
  added_by: {
    type: String,
    required: [true, 'Added by is required'],
    trim: true
  },
  created_date: {
    type: Date,
    default: Date.now
  }
});

// Add pre-save middleware to ensure ID and barcode uniqueness
gasketSchema.pre('save', async function (next) {
  if (!this.isModified('gasket_id')) return next();

  const existingGasket = await mongoose.models.Gasket.findOne({ gasket_id: this.gasket_id });
  if (existingGasket) {
    this.gasket_id = generateId('GSKT'); // Regenerate ID if duplicate found
  }

  if (!this.isModified('barcode')) return next();
  const existingBarcode = await mongoose.models.Gasket.findOne({ barcode: this.barcode });
  if (existingBarcode) {
    this.barcode = generateId('BAR'); // Regenerate barcode if duplicate found
  }
  next();
});

export default mongoose.model('Gasket', gasketSchema);
