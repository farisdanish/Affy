const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    actorRole: { type: String, enum: ['admin', 'agent', 'merchant', 'user', 'public', 'developer'] },
    action: { type: String, required: true }, // e.g. 'slot.created', 'booking.created', 'ref.link_generated'
    entityType: { type: String, enum: ['slot', 'booking', 'referral'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    metadata: { type: Object, default: {} },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
