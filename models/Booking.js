const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    // Discriminator: set server-side only
    bookingType: { type: String, enum: ['guest', 'authenticated'], required: true },
    // Auth flow: populated when bookingType='authenticated'
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Guest flow: required when bookingType='guest'
    guestName: { type: String },
    guestEmail: { type: String },
    // Referral attribution
    refCode: { type: String, default: null },      // raw input, retained for forensics
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // server-resolved
    attributionSource: { type: String, enum: ['query_param'], default: 'query_param' },
    // Server-controlled status
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, { timestamps: true });

// One guest booking per slot per email (sparse: authenticated bookings have no guestEmail)
bookingSchema.index({ slot: 1, guestEmail: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Booking', bookingSchema);