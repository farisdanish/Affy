const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Verify JWT from httpOnly cookie (primary) or Authorization header (fallback).
 * Attaches decoded payload to req.user.
 */
const authenticateToken = (req, res, next) => {
    // H5: prefer httpOnly cookie, fall back to Authorization header for API consumers
    const cookieToken = req.cookies && req.cookies.accessToken;
    const authHeader = req.headers['authorization'];
    const headerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
    const token = cookieToken || headerToken;

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. No token provided.',
            code: 'AUTH_TOKEN_MISSING',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'Invalid or expired token.',
            code: 'AUTH_TOKEN_INVALID',
        });
    }
};

/**
 * Factory that returns middleware checking req.user.role against allowed roles.
 * Must be used AFTER authenticateToken.
 *
 * Usage: authorizeRoles('merchant', 'admin')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({
                message: 'Forbidden. Insufficient permissions.',
                code: 'FORBIDDEN',
            });
        }
        next();
    };
};

const loadMerchantVerification = async (req, res, next) => {
    if (!req.user || req.user.role !== 'merchant') return next();

    try {
        const merchant = await User.findById(req.user.id).select('merchantProfile.verificationStatus');
        if (!merchant) {
            return res.status(404).json({
                message: 'User not found.',
                code: 'USER_NOT_FOUND',
            });
        }

        req.merchantVerificationStatus = merchant.merchantProfile?.verificationStatus || 'pending';
        next();
    } catch (_err) {
        return res.status(500).json({
            message: 'Internal server error.',
            code: 'INTERNAL_ERROR',
        });
    }
};

const requireVerifiedMerchant = async (req, res, next) => {
    if (!req.user || req.user.role !== 'merchant') return next();

    try {
        const status = req.merchantVerificationStatus || (await User.findById(req.user.id).select('merchantProfile.verificationStatus'))?.merchantProfile?.verificationStatus || 'pending';
        if (status !== 'approved') {
            return res.status(403).json({
                message: 'Merchant verification is required for this action.',
                code: 'MERCHANT_NOT_VERIFIED',
            });
        }
        next();
    } catch (_err) {
        return res.status(500).json({
            message: 'Internal server error.',
            code: 'INTERNAL_ERROR',
        });
    }
};

module.exports = { authenticateToken, authorizeRoles, loadMerchantVerification, requireVerifiedMerchant };
