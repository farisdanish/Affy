const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['developer', 'admin', 'agent', 'merchant', 'user'], default: 'user' },
    refCode: { type: String, unique: true, sparse: true, index: true },
    merchantProfile: {
        place: String,
        contactInfo: String,
    },
    payoutConfig: {
        bankName: String,
        accountNumber: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);