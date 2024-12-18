import mongoose from 'mongoose';

// Whitelisted Email Schema
const WhitelistEmailSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address'],
    },
    addedAt: {
        type: Date,
        default: Date.now,
    },
});

const WLuser =  mongoose.model('WhitelistEmail', WhitelistEmailSchema);

export default WLuser;
