const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// GET all slots (public)
router.get('/', async (req, res) => {
    try {
        const slots = await Slot.find();
        res.json(slots);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST create a slot (merchant, admin, developer only)
router.post('/', authenticateToken, authorizeRoles('merchant', 'admin', 'developer'), async (req, res) => {
    try {
        const slot = new Slot(req.body);
        await slot.save();
        res.status(201).json(slot);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;