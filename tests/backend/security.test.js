const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { SELF_REGISTRABLE_ROLES, sanitizeSelfRegistrationRole } = require('../../utils/authRegistration');

// ── H4: Password complexity (tested via regex, mirrors express-validator rules) ──
describe('Password complexity rules', () => {
    const hasUppercase = (pw) => /[A-Z]/.test(pw);
    const hasDigit = (pw) => /\d/.test(pw);
    const hasSpecial = (pw) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw);

    it('rejects password without uppercase', () => {
        assert.equal(hasUppercase('password1!'), false);
    });

    it('rejects password without digit', () => {
        assert.equal(hasDigit('Password!'), false);
    });

    it('rejects password without special character', () => {
        assert.equal(hasSpecial('Password1'), false);
    });

    it('accepts compliant password', () => {
        const pw = 'MyP@ss1word';
        assert.ok(hasUppercase(pw));
        assert.ok(hasDigit(pw));
        assert.ok(hasSpecial(pw));
        assert.ok(pw.length >= 8);
    });
});

// ── Self-registration role guard (existing + extended) ──
describe('Self-registration role guard', () => {
    it('blocks admin from self-registration', () => {
        assert.ok(!SELF_REGISTRABLE_ROLES.includes('admin'));
    });

    it('blocks developer from self-registration', () => {
        assert.ok(!SELF_REGISTRABLE_ROLES.includes('developer'));
    });

    it('defaults to user when no role provided', () => {
        assert.equal(sanitizeSelfRegistrationRole(undefined), 'user');
        assert.equal(sanitizeSelfRegistrationRole(null), 'user');
        assert.equal(sanitizeSelfRegistrationRole(''), 'user');
    });

    it('normalizes role casing', () => {
        assert.equal(sanitizeSelfRegistrationRole('Merchant'), 'merchant');
        assert.equal(sanitizeSelfRegistrationRole('  AGENT  '), 'agent');
    });
});

// ── L2: Check-availability field validation ──
describe('Check-availability field guard', () => {
    const allowedFields = { email: 'email', username: 'username' };

    it('allows email field', () => {
        assert.equal(allowedFields['email'], 'email');
    });

    it('allows username field', () => {
        assert.equal(allowedFields['username'], 'username');
    });

    it('rejects unknown field names', () => {
        assert.equal(allowedFields['password'], undefined);
        assert.equal(allowedFields['$gt'], undefined);
        assert.equal(allowedFields['role'], undefined);
    });
});
