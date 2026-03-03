/**
 * Centralised role constants.
 * Import these instead of scattering raw strings across the codebase.
 */
export const ROLES = {
    ADMIN: 'admin',
    DEVELOPER: 'developer',
    AGENT: 'agent',
    MERCHANT: 'merchant',
    USER: 'user',
};

/**
 * Roles available for self-registration (excludes admin & developer).
 */
export const REGISTRABLE_ROLES = [
    { value: ROLES.USER, label: 'Public User' },
    { value: ROLES.MERCHANT, label: 'Merchant' },
    { value: ROLES.AGENT, label: 'Agent / Influencer' },
];
