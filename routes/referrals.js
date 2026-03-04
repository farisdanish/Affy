const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Slot = require('../models/Slot');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogService');
const { sendError, sendValidationError } = require('../utils/apiError');

// GET /referrals/my-code — agent only
// Returns existing refCode or generates one on first call
router.get('/my-code', authenticateToken, authorizeRoles('agent'), async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');

        if (!user.refCode) {
            // Generate a unique 8-char URL-safe code
            let code;
            let exists = true;
            while (exists) {
                code = nanoid(8);
                exists = await User.exists({ refCode: code });
            }
            user.refCode = code;
            await user.save();
        }

        res.json({ refCode: user.refCode });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

// POST /referrals/link — agent only
// Returns a shareable booking URL for a given slot
router.post(
    '/link',
    authenticateToken,
    authorizeRoles('agent'),
    [body('slotId').notEmpty().isMongoId().withMessage('Valid slotId is required')],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }

        try {
            const { slotId } = req.body;

            const slot = await Slot.findById(slotId);
            if (!slot || slot.isActive === false) {
                return sendError(res, 404, 'Slot not found or unavailable', 'SLOT_UNAVAILABLE');
            }

            let user = await User.findById(req.user.id);
            if (!user.refCode) {
                // Auto-generate if missing
                let code;
                let exists = true;
                while (exists) {
                    code = nanoid(8);
                    exists = await User.exists({ refCode: code });
                }
                user.refCode = code;
                await user.save();
            }

            const baseUrl = process.env.APP_PUBLIC_URL || 'http://localhost:3000';
            const shareUrl = `${baseUrl}/book/${slotId}?ref=${user.refCode}`;

            await logActivity({
                actorId: req.user.id,
                actorRole: req.user.role,
                action: 'ref.link_generated',
                entityType: 'referral',
                entityId: slot._id,
                metadata: {
                    slotId: slot._id,
                    refCode: user.refCode,
                },
            });

            res.json({ shareUrl, refCode: user.refCode, slotId });
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

module.exports = router;
