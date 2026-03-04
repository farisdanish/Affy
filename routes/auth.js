const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

const SELF_REGISTRABLE_ROLES = ['user', 'merchant', 'agent'];

// POST /auth/register
router.post(
  '/register',
  [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('name is required')
      .isLength({ max: 100 })
      .withMessage('name is too long'),
    body('email')
      .trim()
      .normalizeEmail()
      .isEmail()
      .withMessage('valid email is required'),
    body('password')
      .isString()
      .isLength({ min: 8 })
      .withMessage('password must be at least 8 characters'),
    body('role')
      .optional()
      .trim()
      .toLowerCase()
      .isIn(SELF_REGISTRABLE_ROLES)
      .withMessage(`role must be one of: ${SELF_REGISTRABLE_ROLES.join(', ')}`),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: 'Validation failed', errors: errors.array() });
    }

    try {
      const { name, email, password, role } = req.body || {};
      const safeRole = role || 'user';

      // Check if user already exists
      const existing = await User.findOne({ email });
      if (existing) return res.status(400).json({ message: 'Email already registered' });

      // Hash the password
      const hashed = await bcrypt.hash(password, 10);

      // Save user
      const user = new User({ name, email, password: hashed, role: safeRole });
      await user.save();

      res.json({ message: 'User registered successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Sign JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET is not configured' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
