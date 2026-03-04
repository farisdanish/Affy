const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    slot: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    // Discriminator: set server-side only
    bookingType: { type: String, enum: ['guest', 'authenticated'], required: true },
    // Auth flow: populated when bookingType='authenticated'
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    // Guest flow: required when bookingType='guest'
    guestName: { type: String, trim: true },
    guestEmail: { type: String, trim: true, lowercase: true },
    // Referral attribution
    refCode: { type: String, default: null },      // raw input, retained for forensics
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }, // server-resolved
    attributionSource: { type: String, enum: ['query_param'], default: 'query_param' },
    // Server-controlled status
    status: { type: String, enum: ['pending', 'confirmed'], default: 'pending' },
}, { timestamps: true });

// Enforce identity invariants at schema level.
// Exactly one mode is valid:
// - guest: user must be null and guestName/guestEmail are required
// - authenticated: user is required and guestName/guestEmail must be empty
bookingSchema.pre('validate', function enforceIdentityMode() {
    const isGuest = this.bookingType === 'guest';
    const isAuthenticated = this.bookingType === 'authenticated';

    if (!isGuest && !isAuthenticated) {
        this.invalidate('bookingType', 'bookingType must be guest or authenticated');
        return;
    }

    if (isGuest) {
        if (this.user) {
            this.invalidate('user', 'user must be null for guest bookings');
        }
        if (!this.guestName || !this.guestName.trim()) {
            this.invalidate('guestName', 'guestName is required for guest bookings');
        }
        if (!this.guestEmail || !this.guestEmail.trim()) {
            this.invalidate('guestEmail', 'guestEmail is required for guest bookings');
        }
    }

    if (isAuthenticated) {
        if (!this.user) {
            this.invalidate('user', 'user is required for authenticated bookings');
        }
        if (this.guestName) {
            this.invalidate('guestName', 'guestName must be empty for authenticated bookings');
        }
        if (this.guestEmail) {
            this.invalidate('guestEmail', 'guestEmail must be empty for authenticated bookings');
        }
    }

});

// One guest booking per slot per email (sparse: authenticated bookings have no guestEmail)
bookingSchema.index({ slot: 1, guestEmail: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Booking', bookingSchema);
