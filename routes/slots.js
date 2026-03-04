const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Slot = require('../models/Slot');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const { logActivity } = require('../services/activityLogService');

// GET /slots/public — public, active + valid/future time window only
router.get('/public', async (req, res) => {
    try {
        const now = new Date();
        const slots = await Slot.find({
            isActive: true,
            $or: [
                // New model: show ongoing or future windows by endTime.
                { endTime: { $gte: now } },
                // Partial new model fallback: no endTime but future startTime.
                { endTime: { $exists: false }, startTime: { $gte: now } },
                { endTime: null, startTime: { $gte: now } },
                // Legacy model fallback: date-only future slots.
                { startTime: { $exists: false }, endTime: { $exists: false }, date: { $gte: now } },
                { startTime: null, endTime: null, date: { $gte: now } },
            ],
        }).sort({ startTime: 1, date: 1 });

        // Final guard for invalid windows: if both times exist, enforce start <= end.
        const filtered = slots.filter((slot) => {
            if (slot.startTime && slot.endTime) {
                return slot.startTime <= slot.endTime;
            }
            return true;
        });

        res.json(filtered);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
        res.status(500).json({ message: err.message });
    }
});

// GET /slots — restricted to privileged roles only (prevents leaking inactive/private data)
router.get('/', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const slots = await Slot.find();
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
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
            res.status(500).json({ message: err.message });
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
            return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
        }
        try {
            const slot = await Slot.findById(req.params.id);
            if (!slot) return res.status(404).json({ message: 'Slot not found' });

            // Owner check
            if (slot.merchant.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'developer') {
                return res.status(403).json({ message: 'Forbidden. You do not own this slot.' });
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
            res.status(500).json({ message: err.message });
        }
    }
);

// DELETE /slots/:id — soft delete (sets isActive=false)
router.delete('/:id', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const slot = await Slot.findById(req.params.id);
        if (!slot) return res.status(404).json({ message: 'Slot not found' });

        // Owner check
        if (slot.merchant.toString() !== req.user.id && req.user.role !== 'admin' && req.user.role !== 'developer') {
            return res.status(403).json({ message: 'Forbidden. You do not own this slot.' });
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
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
