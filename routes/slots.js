const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Slot = require('../models/Slot');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogService');
const { sendError, sendValidationError } = require('../utils/apiError');
const { buildPublicSlotsQuery, isValidSlotWindow } = require('../utils/slotVisibility');

// GET /slots/public — public, active + valid/future time window only
router.get('/public', async (req, res) => {
    try {
        const now = new Date();
        const slots = await Slot.find(buildPublicSlotsQuery(now)).sort({ startTime: 1, date: 1 });
        const filtered = slots.filter(isValidSlotWindow);

        res.json(filtered);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

// GET /slots/mine — authenticated merchant/admin/developer scope
router.get('/mine', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const query = req.user.role === 'admin' || req.user.role === 'developer'
            ? {}
            : { merchant: req.user.id };
        const slots = await Slot.find(query).sort({ createdAt: -1 });
        res.json(slots);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

// GET /slots — restricted to privileged roles only (prevents leaking inactive/private data)
router.get('/', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const slots = await Slot.find();
        res.json(slots);
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

// POST /slots — create a slot (merchant, admin, developer)
router.post(
    '/',
    authenticateToken,
    authorizeRoles('merchant', 'admin', 'developer'),
    [
        body('title').trim().notEmpty().withMessage('title is required'),
        body('price').optional().isFloat({ min: 0 }).withMessage('price must be a positive number'),
        body('startTime').optional().isISO8601().withMessage('startTime must be a valid date'),
        body('endTime').optional().isISO8601().withMessage('endTime must be a valid date'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
        try {
            const { title, description, price, startTime, endTime, capacity, locationLabel } = req.body;
            const slot = new Slot({
                merchant: req.user.id,
                title,
                description,
                price,
                startTime,
                endTime,
                capacity,
                locationLabel,
                isActive: true,
            });
            await slot.save();
            await logActivity({
                actorId: req.user.id,
                actorRole: req.user.role,
                action: 'slot.created',
                entityType: 'slot',
                entityId: slot._id,
                metadata: { title: slot.title },
            });
            res.status(201).json(slot);
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

// PUT /slots/:id — update (owner or admin/developer)
router.put(
    '/:id',
    authenticateToken,
    authorizeRoles('merchant', 'admin', 'developer'),
    [
        body('title').optional().trim().notEmpty().withMessage('title cannot be blank'),
        body('price').optional().isFloat({ min: 0 }).withMessage('price must be a positive number'),
        body('startTime').optional().isISO8601().withMessage('startTime must be a valid date'),
        body('endTime').optional().isISO8601().withMessage('endTime must be a valid date'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return sendValidationError(res, errors.array());
        }
        try {
            const slot = await Slot.findById(req.params.id);
            if (!slot) return sendError(res, 404, 'Slot not found', 'SLOT_NOT_FOUND');

            // Owner check
            if (slot.merchant.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'developer') {
                return sendError(res, 403, 'Forbidden. You do not own this slot.', 'SLOT_OWNERSHIP_REQUIRED');
            }

            const allowed = ['title', 'description', 'price', 'startTime', 'endTime', 'isActive', 'capacity', 'locationLabel'];
            allowed.forEach(field => {
                if (req.body[field] !== undefined) slot[field] = req.body[field];
            });

            await slot.save();
            await logActivity({
                actorId: req.user.id,
                actorRole: req.user.role,
                action: 'slot.updated',
                entityType: 'slot',
                entityId: slot._id,
                metadata: { updatedFields: Object.keys(req.body || {}) },
            });
            res.json(slot);
        } catch (err) {
            return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
        }
    }
);

// DELETE /slots/:id — soft delete (sets isActive=false)
router.delete('/:id', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) return sendError(res, 404, 'Slot not found', 'SLOT_NOT_FOUND');

        // Owner check
        if (slot.merchant.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'developer') {
            return sendError(res, 403, 'Forbidden. You do not own this slot.', 'SLOT_OWNERSHIP_REQUIRED');
        }

        slot.isActive = false;
        await slot.save();
        await logActivity({
            actorId: req.user.id,
            actorRole: req.user.role,
            action: 'slot.deleted',
            entityType: 'slot',
            entityId: slot._id,
            metadata: { softDelete: true },
        });
        res.json({ message: 'Slot deactivated', slot });
    } catch (err) {
        return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
});

module.exports = router;
