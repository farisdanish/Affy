const jwt = require('jsonwebtoken');

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

module.exports = { authenticateToken, authorizeRoles };
