const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const Slot = require('../models/Slot');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');

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
];

// POST /bookings — public (guest) or authenticated
router.post('/', bookingRateLimit, bookingValidation, async (req, res) => {
    // 1. Validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    // 2. Honeypot check — reject bots
    if (req.body._hp) {
        return res.status(400).json({ message: 'Bad request' });
    }

    const { slotId, guestName, guestEmail, ref } = req.body;

    try {
        // 3. Validate slot exists and is active
        const slot = await Slot.findById(slotId);
        if (!slot || slot.isActive === false) {
            return res.status(404).json({ message: 'Slot not found or unavailable' });
        }

        // 4. Resolve agentId server-side from refCode — never trust client
        let resolvedAgentId = null;
        let resolvedRefCode = null;
        if (ref) {
            resolvedRefCode = ref;
            const agent = await User.findOne({ refCode: ref, role: 'agent' });
            if (agent) resolvedAgentId = agent._id;
        }

        // 5. Determine bookingType and identity
        // Try to optionally authenticate the user (non-blocking if no token present)
        let bookingUserId = null;
        let bookingType = 'guest';
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ')) {
            try {
                const jwt = require('jsonwebtoken');
                const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET);
                bookingUserId = decoded.id;
                bookingType = 'authenticated';
            } catch (_) {
                // Invalid token → treat as guest
            }
        }

        // 6. Guest flow: require identity fields
        if (bookingType === 'guest') {
            if (!guestName || !guestEmail) {
                return res.status(400).json({ message: 'guestName and guestEmail are required for guest bookings' });
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
            attributionSource: ref ? 'query_param' : undefined,
            status: 'pending',  // always server-set
        });

        await booking.save();
        return res.status(201).json({ booking });

    } catch (err) {
        // 8. Duplicate key → already booked with this email + slot
        if (err.code === 11000) {
            return res.status(409).json({ message: 'A booking for this slot already exists for this email' });
        }
        console.error('Booking error:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
