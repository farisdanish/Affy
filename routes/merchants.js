const express = require('express');
const router = express.Router();
const { param, body, validationResult } = require('express-validator');
const User = require('../models/User');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogService');
const { sendError, sendValidationError } = require('../utils/apiError');

const merchantIdValidation = [
    param('id').isMongoId().withMessage('Valid merchant id is required'),
];

router.get('/pending-verification', authenticateToken, authorizeRoles('admin', 'developer'), async (req, res) => {
    try {
        const merchants = await User.find({
            role: 'merchant',
            $or: [
                { 'merchantProfile.verificationStatus': 'pending' },
                { 'merchantProfile.verificationStatus': { $exists: false } },
            ],
        })
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({ merchants });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

router.patch(
    '/:id/verify',
    authenticateToken,
    authorizeRoles('admin', 'developer'),
    merchantIdValidation,
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendValidationError(res, errors.array());

        try {
            const merchant = await User.findById(req.params.id);
            if (!merchant) return sendError(res, 404, 'Merchant not found', 'MERCHANT_NOT_FOUND');
            if (merchant.role !== 'merchant') return sendError(res, 400, 'User is not a merchant', 'NOT_A_MERCHANT');

            merchant.merchantProfile = merchant.merchantProfile || {};
            merchant.merchantProfile.verificationStatus = 'approved';
            merchant.merchantProfile.verifiedAt = new Date();
            merchant.merchantProfile.verifiedBy = req.user.id;
            merchant.merchantProfile.rejectionReason = undefined;
            await merchant.save();

            await logActivity({
                actorId: req.user.id,
                actorRole: req.user.role,
                action: 'merchant.verification.approved',
                entityType: 'user',
                entityId: merchant._id,
                metadata: { verificationStatus: 'approved' },
            });

            const sanitized = merchant.toObject();
            delete sanitized.password;
            res.json({ merchant: sanitized });
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

router.patch(
    '/:id/reject',
    authenticateToken,
    authorizeRoles('admin', 'developer'),
    [
        ...merchantIdValidation,
        body('reason').trim().notEmpty().isLength({ max: 300 }).withMessage('reason is required and must be up to 300 characters'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return sendValidationError(res, errors.array());

        try {
            const merchant = await User.findById(req.params.id);
            if (!merchant) return sendError(res, 404, 'Merchant not found', 'MERCHANT_NOT_FOUND');
            if (merchant.role !== 'merchant') return sendError(res, 400, 'User is not a merchant', 'NOT_A_MERCHANT');

            merchant.merchantProfile = merchant.merchantProfile || {};
            merchant.merchantProfile.verificationStatus = 'rejected';
            merchant.merchantProfile.verifiedAt = null;
            merchant.merchantProfile.verifiedBy = req.user.id;
            merchant.merchantProfile.rejectionReason = req.body.reason;
            await merchant.save();

            await logActivity({
                actorId: req.user.id,
                actorRole: req.user.role,
                action: 'merchant.verification.rejected',
                entityType: 'user',
                entityId: merchant._id,
                metadata: { verificationStatus: 'rejected' },
            });

            const sanitized = merchant.toObject();
            delete sanitized.password;
            res.json({ merchant: sanitized });
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

module.exports = router;
