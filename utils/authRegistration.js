const SELF_REGISTRABLE_ROLES = ['user', 'merchant', 'agent'];

const sanitizeSelfRegistrationRole = (role) => {
    if (!role) return 'user';
    return String(role).trim().toLowerCase();
};

module.exports = {
    SELF_REGISTRABLE_ROLES,
    sanitizeSelfRegistrationRole,
};
