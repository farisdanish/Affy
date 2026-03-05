const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { sendError, sendValidationError } = require('../utils/apiError');
const { SELF_REGISTRABLE_ROLES, sanitizeSelfRegistrationRole } = require('../utils/authRegistration');

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
    body('username')
      .trim()
      .notEmpty()
      .withMessage('username is required')
      .isAlphanumeric()
      .withMessage('username must contain only letters and numbers')
      .isLength({ min: 3, max: 30 })
      .withMessage('username must be between 3 and 30 characters'),
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
      return sendValidationError(res, errors.array());
    }

    try {
      const { name, username, email, password, role } = req.body || {};
      const safeRole = sanitizeSelfRegistrationRole(role);

      // Check if user already exists
      const existing = await User.findOne({ $or: [{ email }, { username }] });
      if (existing) {
        if (existing.email === email) return sendError(res, 400, 'Email already registered', 'EMAIL_ALREADY_REGISTERED');
        if (existing.username === username) return sendError(res, 400, 'Username already taken', 'USERNAME_ALREADY_TAKEN');
      }

      // Hash the password
      const hashed = await bcrypt.hash(password, 10);

      // Save user
      const user = new User({ name, username, email, password: hashed, role: safeRole });
      await user.save();

      res.json({ message: 'User registered successfully' });
    } catch (err) {
      return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
  }
);

// POST /auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body || {};
    if (!identifier || typeof identifier !== 'string' || !password) {
      return sendError(res, 400, 'identifier and password are required', 'MISSING_CREDENTIALS');
    }

    // Find user (by email or username)
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier }
      ]
    });
    if (!user) return sendError(res, 400, 'Invalid credentials', 'INVALID_CREDENTIALS');

    // Check password
    const match = await bcrypt.compare(password, user.password);
    if (!match) return sendError(res, 400, 'Invalid credentials', 'INVALID_CREDENTIALS');

    // Sign JWT
    if (!process.env.JWT_SECRET) {
      return sendError(res, 500, 'JWT_SECRET is not configured', 'SERVER_MISCONFIG');
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
  }
});

module.exports = router;
