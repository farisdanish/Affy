const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    name: String,
    username: { type: String, unique: true, sparse: true, trim: true },
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ['developer', 'admin', 'agent', 'merchant', 'user'], default: 'user' },
    refCode: { type: String, unique: true, sparse: true, index: true },
    merchantProfile: {
        businessName: String,
        businessType: String,
        address: String,
        city: String,
        state: String,
        country: String,
        geo: {
            lat: Number,
            lng: Number,
        },
        place: String,
        contactInfo: String,
        verificationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending', index: true },
        ssmNumber: String,
        verificationDocs: [{ type: String }],
        verifiedAt: Date,
        verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
        rejectionReason: String,
    },
    payoutConfig: {
        bankName: String,
        accountNumber: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
