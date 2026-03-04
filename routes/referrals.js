const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const Slot = require('../models/Slot');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogService');

// GET /referrals/my-code — agent only
// Returns existing refCode or generates one on first call
router.get('/my-code', authenticateToken, authorizeRoles('agent'), async (req, res) => {
    try {
        let user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

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
        res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }

        try {
            const { slotId } = req.body;

            const slot = await Slot.findById(slotId);
            if (!slot || slot.isActive === false) {
                return res.status(404).json({ message: 'Slot not found or unavailable' });
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
            res.status(500).json({ message: err.message });
        }
    }
);

module.exports = router;
