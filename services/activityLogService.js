const ActivityLog = require('../models/ActivityLog');

/**
 * Best-effort activity logging. Failures are swallowed so business flows continue.
 */
const logActivity = async ({
    actorId = null,
    actorRole = 'public',
    action,
    entityType,
    entityId = null,
    metadata = {},
}) => {
    try {
        await ActivityLog.create({
            actorId,
            actorRole,
            action,
            entityType,
            entityId,
            metadata,
        });
    } catch (err) {
        console.error('Activity log write failed:', err.message);
    }
};

module.exports = { logActivity };
