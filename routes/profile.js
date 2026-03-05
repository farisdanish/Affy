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
        body('merchantProfile.businessName').optional().trim().isLength({ max: 120 }).withMessage('businessName is too long'),
        body('merchantProfile.businessType').optional().trim().isLength({ max: 80 }).withMessage('businessType is too long'),
        body('merchantProfile.address').optional().trim().isLength({ max: 300 }).withMessage('address is too long'),
        body('merchantProfile.city').optional().trim().isLength({ max: 100 }).withMessage('city is too long'),
        body('merchantProfile.state').optional().trim().isLength({ max: 100 }).withMessage('state is too long'),
        body('merchantProfile.country').optional().trim().isLength({ max: 100 }).withMessage('country is too long'),
        body('merchantProfile.geo.lat').optional().isFloat({ min: -90, max: 90 }).withMessage('merchantProfile.geo.lat must be a valid latitude'),
        body('merchantProfile.geo.lng').optional().isFloat({ min: -180, max: 180 }).withMessage('merchantProfile.geo.lng must be a valid longitude'),
        body('merchantProfile.place').optional().trim().isLength({ max: 200 }).withMessage('place is too long'),
        body('merchantProfile.contactInfo').optional().trim().isLength({ max: 200 }).withMessage('contactInfo is too long'),
        body('merchantProfile.ssmNumber').optional().trim().isLength({ max: 50 }).withMessage('ssmNumber is too long'),
        body('merchantProfile.verificationDocs').optional().isArray({ max: 10 }).withMessage('verificationDocs must be an array with up to 10 items'),
        body('merchantProfile.verificationDocs.*').optional().trim().isLength({ max: 500 }).withMessage('verificationDocs item is too long'),
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
                const merchantProfileKeys = [
                    'businessName',
                    'businessType',
                    'address',
                    'city',
                    'state',
                    'country',
                    'place',
                    'contactInfo',
                    'ssmNumber',
                    'verificationDocs',
                ];

                merchantProfileKeys.forEach((key) => {
                    if (body.merchantProfile[key] !== undefined) {
                        updateFields[`merchantProfile.${key}`] = body.merchantProfile[key];
                    }
                });

                if (body.merchantProfile.geo !== undefined) {
                    if (body.merchantProfile.geo.lat !== undefined) {
                        updateFields['merchantProfile.geo.lat'] = body.merchantProfile.geo.lat;
                    }
                    if (body.merchantProfile.geo.lng !== undefined) {
                        updateFields['merchantProfile.geo.lng'] = body.merchantProfile.geo.lng;
                    }
                }
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
