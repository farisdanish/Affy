const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
    // Sprint 1 fields (kept for backward compatibility)
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    date: Date,
    available: { type: Boolean, default: true },
    // Sprint 2 fields
    title: { type: String, required: true },
    description: String,
    price: { type: Number },
    startTime: { type: Date },
    endTime: { type: Date },
    isActive: { type: Boolean, default: true },
    capacity: { type: Number },
    locationLabel: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);