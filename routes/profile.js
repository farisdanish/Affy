const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { sendError } = require('../utils/apiError');
const { authenticateToken } = require('../middleware/auth');

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

        let updateFields = {};

        // Allow updating common fields
        if (body.name !== undefined) updateFields.name = body.name;

        // Handle unique field updates (Email/Username)
        if (body.email) {
            const emailExists = await User.findOne({ email: body.email, _id: { $ne: req.user.id } });
            if (emailExists) return sendError(res, 400, 'Email already in use', 'EMAIL_ALREADY_IN_USE');
            updateFields.email = body.email;
        }

        if (body.username) {
            const usernameExists = await User.findOne({ username: body.username, _id: { $ne: req.user.id } });
            if (usernameExists) return sendError(res, 400, 'Username already taken', 'USERNAME_ALREADY_TAKEN');
            updateFields.username = body.username;
        }

        // For Merchant, Developer: update merchant profile
        if (['merchant', 'developer'].includes(userRole) && body.merchantProfile) {
            updateFields['merchantProfile.place'] = body.merchantProfile.place;
            updateFields['merchantProfile.contactInfo'] = body.merchantProfile.contactInfo;
        }

        // For Agent, User: update payout config
        if (['agent', 'user'].includes(userRole) && body.payoutConfig) {
            updateFields['payoutConfig.bankName'] = body.payoutConfig.bankName;
            updateFields['payoutConfig.accountNumber'] = body.payoutConfig.accountNumber;
        }

        if (Object.keys(updateFields).length === 0) {
            const user = await User.findById(req.user.id).select('-password');
            return res.json(user);
        }

        // Find and update user, return updated doc
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { $set: updateFields },
            { new: true, runValidators: true }
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
