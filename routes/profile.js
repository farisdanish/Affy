const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendError, sendValidationError } = require('../utils/apiError');
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

// M1: PUT /profile — validate all input fields
router.put(
    '/',
    authenticateToken,
    [
        body('name').optional().trim().notEmpty().withMessage('name cannot be blank').isLength({ max: 100 }).withMessage('name is too long'),
        body('email').optional().trim().normalizeEmail().isEmail().withMessage('valid email is required'),
        body('username').optional().trim().isAlphanumeric().withMessage('username must contain only letters and numbers').isLength({ min: 3, max: 30 }).withMessage('username must be between 3 and 30 characters'),
        body('merchantProfile.place').optional().trim().isLength({ max: 200 }).withMessage('place is too long'),
        body('merchantProfile.contactInfo').optional().trim().isLength({ max: 200 }).withMessage('contactInfo is too long'),
        body('payoutConfig.bankName').optional().trim().isLength({ max: 100 }).withMessage('bankName is too long'),
        body('payoutConfig.accountNumber').optional().trim().isLength({ max: 50 }).withMessage('accountNumber is too long'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
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
