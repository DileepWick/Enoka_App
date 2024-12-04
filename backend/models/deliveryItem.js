import mongoose from 'mongoose';

const deliveryItemSchema = new mongoose.Schema({
  item: { 
    type: mongoose.Schema.Types.ObjectId, 
    required: true, 
    refPath: 'itemType' // Dynamically references different schemas based on 'itemType'
  },
  itemType: { 
    type: String, 
    required: true 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  status: { 
    type: String, 
    enum: ['Pending', 'Received', 'Count mismatch'], 
    default: 'Pending', 
    required: true 
  },
  deliveryId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Delivery', // Reference to the Delivery model
    required: true 
  }
}, {
  timestamps: true
});

const DeliveryItem = mongoose.model('DeliveryItem', deliveryItemSchema);

export default DeliveryItem;
