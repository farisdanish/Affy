const express = require('express');
const router = express.Router();
const Slot = require('../models/Slot');

// GET all slots
router.get('/', async (req, res) => {
    const slots = await Slot.find();
    res.json(slots);
});

// POST create a slot
router.post('/', async (req, res) => {
    const slot = new Slot(req.body);
    await slot.save();
    res.json(slot);
});

module.exports = router;