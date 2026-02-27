const mongoose = require('mongoose');
const bookingSchema = new mongoose.Schema({
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    agentRef: String,  // captures ?ref=agentId from the URL
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);