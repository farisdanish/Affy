const mongoose = require('mongoose');
const slotSchema = new mongoose.Schema({
    merchant: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    title: String,
    description: String,
    date: Date,
    available: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);