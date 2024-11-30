import mongoose from 'mongoose';

const DeliveryListSchema = new mongoose.Schema({
  items: [
    {
      item_type: {
        type: String,
        required: true,
        enum: ['Gasket', 'Piston'], // Add more item types as needed
      },
      item_id: {
        type: mongoose.Schema.Types.ObjectId, // Reference to either Gasket or Piston
        required: true,
        refPath: 'items.item_type', // Dynamically reference the correct model
      },
    },
  ],
  branch_from: {
    type: String,
    required: [true, '"From" branch is required'],
    trim: true,
  },
  branch_to: {
    type: String,
    required: [true, '"To" branch is required'],
    trim: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'shipped', 'delivered', 'cancelled'], // Predefined statuses
    default: 'pending',
  },
  created_at: {
    type: Date,
    default: Date.now, // Automatically set creation date
  },
  due_arrival: {
    type: Date,
    required: [true, 'Due arrival date is required'],
  },
});

// Ensure the delivery list has at least one item
DeliveryListSchema.pre('save', function (next) {
  if (!this.items || this.items.length === 0) {
    return next(new Error('Delivery list must include at least one item'));
  }
  next();
});

export default mongoose.model('DeliveryList', DeliveryListSchema);
