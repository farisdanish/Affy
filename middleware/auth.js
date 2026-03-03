const jwt = require('jsonwebtoken');

/**
 * Verify JWT from Authorization header and attach decoded user to req.user.
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
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
            return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
        }
        next();
    };
};

module.exports = { authenticateToken, authorizeRoles };
