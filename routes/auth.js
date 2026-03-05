const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');
const mongoSanitize = require('express-mongo-sanitize');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const { sendError, sendValidationError } = require('../utils/apiError');
const { SELF_REGISTRABLE_ROLES, sanitizeSelfRegistrationRole } = require('../utils/authRegistration');

// ── Cookie helpers ────────────────────────────────────────────────
const isProduction = () => process.env.NODE_ENV === 'production';

const setTokenCookies = (res, accessToken, refreshToken) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'strict' : 'lax',
    maxAge: 15 * 60 * 1000,       // 15 min
  });
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: isProduction() ? 'strict' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/api/v1/auth',            // only sent to auth endpoints
  });
};

const clearTokenCookies = (res) => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken', { path: '/api/v1/auth' });
};

const signTokens = (user) => {
  const payload = { id: user._id, role: user.role };
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// ── Rate limiters ─────────────────────────────────────────────────
// H2: Rate limit auth endpoints to prevent brute-force
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: 'Too many attempts. Please try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
});

// M4: Rate limit check-availability to prevent enumeration
const availabilityRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { message: 'Too many requests. Please try again later.', code: 'RATE_LIMITED' },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── POST /auth/register ───────────────────────────────────────────
router.post(
  '/register',
  authRateLimit,
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
      .withMessage('password must be at least 8 characters')
      // H4: Password complexity — require uppercase, digit, and special char
      .matches(/[A-Z]/)
      .withMessage('password must contain at least one uppercase letter')
      .matches(/\d/)
      .withMessage('password must contain at least one digit')
      .matches(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/)
      .withMessage('password must contain at least one special character'),
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

// ── POST /auth/login ──────────────────────────────────────────────
router.post(
  '/login',
  authRateLimit,
  [
    // M2: Validate login fields with express-validator
    body('identifier')
      .trim()
      .notEmpty()
      .withMessage('identifier is required')
      .isString()
      .withMessage('identifier must be a string'),
    body('password')
      .notEmpty()
      .withMessage('password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return sendValidationError(res, errors.array());
    }

    try {
      const { identifier, password } = req.body;

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

      // H3: Sign short-lived access + long-lived refresh tokens
      if (!process.env.JWT_SECRET) {
        return sendError(res, 500, 'JWT_SECRET is not configured', 'SERVER_MISCONFIG');
      }
      const { accessToken, refreshToken } = signTokens(user);

      // H5: Set httpOnly cookies
      setTokenCookies(res, accessToken, refreshToken);

      res.json({ user: { id: user._id, name: user.name, email: user.email, username: user.username, role: user.role } });
    } catch (err) {
      return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
    }
  }
);

// ── POST /auth/refresh ────────────────────────────────────────────
// H3: Rotate access token using refresh token cookie
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies && req.cookies.refreshToken;
  if (!refreshToken) {
    return sendError(res, 401, 'No refresh token', 'REFRESH_TOKEN_MISSING');
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      clearTokenCookies(res);
      return sendError(res, 401, 'User not found', 'USER_NOT_FOUND');
    }

    const tokens = signTokens(user);
    setTokenCookies(res, tokens.accessToken, tokens.refreshToken);

    res.json({ user: { id: user._id, name: user.name, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    clearTokenCookies(res);
    return sendError(res, 401, 'Invalid or expired refresh token', 'REFRESH_TOKEN_INVALID');
  }
});

// ── POST /auth/logout ─────────────────────────────────────────────
// H5: Clear both cookies
router.post('/logout', (_req, res) => {
  clearTokenCookies(res);
  res.json({ message: 'Logged out successfully' });
});

// ── GET /auth/me ──────────────────────────────────────────────────
// H5: Client calls this on mount instead of reading localStorage
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return sendError(res, 404, 'User not found', 'USER_NOT_FOUND');
    res.json({ user: { id: user._id, name: user.name, email: user.email, username: user.username, role: user.role } });
  } catch (err) {
    return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
  }
});

// ── GET /auth/check-availability ──────────────────────────────────
router.get('/check-availability', availabilityRateLimit, async (req, res) => {
  try {
    const { field, value, excludeId } = req.query;
    if (!field || !value) {
      return sendError(res, 400, 'field and value are required', 'MISSING_PARAMS');
    }

    // L2: Explicit field mapping instead of dynamic key to prevent query injection
    const allowedFields = { email: 'email', username: 'username' };
    const dbField = allowedFields[field];
    if (!dbField) {
      return sendError(res, 400, 'invalid field', 'INVALID_FIELD');
    }

    const query = { [dbField]: mongoSanitize.sanitize(value) };
    if (excludeId) {
      query._id = { $ne: mongoSanitize.sanitize(excludeId) };
    }

    const existing = await User.findOne(query);
    res.json({ available: !existing });
  } catch (err) {
    return sendError(res, 500, 'Internal server error', 'INTERNAL_ERROR', err.message);
  }
});

module.exports = router;
