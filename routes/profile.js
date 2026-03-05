const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendError } = require('../utils/apiError');
const authenticateToken = require('../middleware/authMiddleware');

// GET /profile
router.get('/', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }
        res.json(user);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

// PUT /profile
router.put('/', authenticateToken, async (req, res) => {
    try {
        const userRole = req.user.role;
        const body = req.body || {};

        // Create an update object, ensuring users can't modify structural paths like 'role'
        let updateFields = {};

        // For Merchant, Admin, Developer: update merchant profile
        if (['merchant', 'admin', 'developer'].includes(userRole) && body.merchantProfile) {
            updateFields['merchantProfile.place'] = body.merchantProfile.place;
            updateFields['merchantProfile.contactInfo'] = body.merchantProfile.contactInfo;
        }

        // For Agent, User: update payout config
        if (['agent', 'user'].includes(userRole) && body.payoutConfig) {
            updateFields['payoutConfig.bankName'] = body.payoutConfig.bankName;
            updateFields['payoutConfig.accountNumber'] = body.payoutConfig.accountNumber;
        }

        // Find and update user, return updated doc
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
        }

        res.json(updatedUser);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

module.exports = router;
