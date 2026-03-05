const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, query, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { logActivity } = require('../services/activityLogService');
const { sendError, sendValidationError } = require('../utils/apiError');
const { REF_CODE_REGEX, resolveRefInput } = require('../utils/bookingRef');

// Rate limiting: 5 requests per 15 minutes per IP
const bookingRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { message: 'Too many booking attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation schema
const bookingValidation = [
    body('slotId').notEmpty().isMongoId().withMessage('Valid slotId is required'),
    body('guestName').optional().trim().notEmpty().withMessage('guestName cannot be blank'),
    body('guestEmail').optional().trim().normalizeEmail().isEmail().withMessage('Valid guestEmail is required for guest booking'),
    query('ref')
        .optional()
        .trim()
        .matches(REF_CODE_REGEX)
        .withMessage('ref must be URL-safe and 1-32 chars'),
    body('ref')
        .optional()
        .trim()
        .matches(REF_CODE_REGEX)
        .withMessage('ref must be URL-safe and 1-32 chars'),
];

// POST /bookings — public (guest) or authenticated
router.post('/', bookingRateLimit, bookingValidation, async (req, res) => {
    // 1. Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return sendValidationError(res, errors.array());
    }

    // 2. Honeypot check — reject bots
    if (req.body._hp) {
        return sendError(res, 400, 'Bad request', 'HONEYPOT_TRIGGERED');
    }

    const { slotId, guestName, guestEmail } = req.body;
    const refResolution = resolveRefInput({ queryRef: req.query.ref, bodyRef: req.body.ref });
    if (refResolution.error === 'REF_CONFLICT') {
        return sendError(res, 400, 'Conflicting ref values between query and body', 'REF_CONFLICT');
    }

    // Contract: query param is the primary source; body ref remains temporary fallback.
    const resolvedRefInput = refResolution.ref;

    try {
        // 3. Validate slot exists and is active
        const slot = await Slot.findById(slotId);
        if (!slot || slot.isActive === false) {
            return sendError(res, 404, 'Slot not found or unavailable', 'SLOT_UNAVAILABLE');
        }

        const slotMerchant = await User.findById(slot.merchant).select('merchantProfile.verificationStatus');
        const merchantVerificationStatus = slotMerchant?.merchantProfile?.verificationStatus || 'pending';
        if (resolvedRefInput && merchantVerificationStatus !== 'approved') {
            return sendError(res, 403, 'Merchant verification is required for referral attribution', 'MERCHANT_NOT_VERIFIED');
        }

        // 4. Resolve agentId server-side from refCode — never trust client
        let resolvedAgentId = null;
        let resolvedRefCode = null;
        if (resolvedRefInput) {
            resolvedRefCode = resolvedRefInput;
            const agent = await User.findOne({ refCode: resolvedRefInput, role: 'agent' });
            if (agent) resolvedAgentId = agent._id;
        }

        // 5. Determine bookingType and identity
        // Try to optionally authenticate the user (non-blocking if no token present)
        let bookingUserId = null;
        let bookingType = 'guest';
        let actorRole = 'public';
        // H5: prefer httpOnly cookie, fall back to Authorization header
        const cookieToken = req.cookies && req.cookies.accessToken;
        const authHeader = req.headers['authorization'];
        const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
        const optionalToken = cookieToken || headerToken;
        if (optionalToken) {
            try {
                const decoded = jwt.verify(optionalToken, process.env.JWT_SECRET);
                bookingUserId = decoded.id;
                bookingType = 'authenticated';
                actorRole = decoded.role || 'user';
            } catch (_) {
                // Invalid token → treat as guest
            }
        }

        // 6. Guest flow: require identity fields
        if (bookingType === 'guest') {
            if (!guestName || !guestEmail) {
                return sendError(res, 400, 'guestName and guestEmail are required for guest bookings', 'GUEST_FIELDS_REQUIRED');
            }
        }

        // 7. Build booking — status and agentId always server-set
        const booking = new Booking({
            slot: slotId,
            bookingType,
            user: bookingUserId,
            guestName: bookingType === 'guest' ? guestName : undefined,
            guestEmail: bookingType === 'guest' ? guestEmail : undefined,
            refCode: resolvedRefCode,
            agentId: resolvedAgentId,
            attributionSource: resolvedRefCode ? 'query_param' : undefined,
            status: 'pending',  // always server-set
        });

        await booking.save();
        await logActivity({
            actorId: bookingUserId,
            actorRole,
            action: 'booking.created',
            entityType: 'booking',
            entityId: booking._id,
            metadata: {
                slotId,
                refCode: resolvedRefCode,
                agentId: resolvedAgentId,
                bookingType,
            },
        });
        return res.status(201).json({ booking });

    } catch (err) {
        // 8. Duplicate key → already booked with this email + slot
        if (err.code === 11000) {
            return sendError(res, 409, 'A booking for this slot already exists for this email', 'DUPLICATE_BOOKING');
        }
        console.error('Booking error:', err);
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

module.exports = router;
