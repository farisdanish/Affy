const test = require('node:test');
const assert = require('node:assert/strict');
const { SELF_REGISTRABLE_ROLES, sanitizeSelfRegistrationRole } = require('../../utils/authRegistration');

test('self-registrable roles are restricted to user, merchant, agent', () => {
    assert.deepEqual(SELF_REGISTRABLE_ROLES, ['user', 'merchant', 'agent']);
});

test('sanitizeSelfRegistrationRole defaults to user when role is missing', () => {
    assert.equal(sanitizeSelfRegistrationRole(undefined), 'user');
    assert.equal(sanitizeSelfRegistrationRole(''), 'user');
});

test('sanitizeSelfRegistrationRole trims and normalizes role casing', () => {
    assert.equal(sanitizeSelfRegistrationRole(' Merchant '), 'merchant');
    assert.equal(sanitizeSelfRegistrationRole('AGENT'), 'agent');
});
