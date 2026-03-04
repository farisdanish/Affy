const express = require('express');
const router = express.Router();
const ActivityLog = require('../models/ActivityLog');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { sendError } = require('../utils/apiError');

// GET /activity-logs?page=1&limit=20&action=...&entityType=...
router.get(
    '/',
    authenticateToken,
    authorizeRoles('admin', 'developer'),
    async (req, res) => {
        try {
            const page = Math.max(parseInt(req.query.page || '1', 10), 1);
            const requestedLimit = parseInt(req.query.limit || '20', 10);
            const limit = Math.min(Math.max(requestedLimit, 1), 100);

            const filter = {};
            if (req.query.action) filter.action = req.query.action;
            if (req.query.entityType) filter.entityType = req.query.entityType;

            const [data, total] = await Promise.all([
                ActivityLog.find(filter)
                    .sort({ createdAt: -1 })
                    .skip((page - 1) * limit)
                    .limit(limit),
                ActivityLog.countDocuments(filter),
            ]);

            return res.json({
                data,
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit) || 1,
            });
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

module.exports = router;
