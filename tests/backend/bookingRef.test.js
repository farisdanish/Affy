const test = require('node:test');
const assert = require('node:assert/strict');
const { isValidRefCode, resolveRefInput, sanitizeRefCode } = require('../../utils/bookingRef');

test('sanitizeRefCode trims string values', () => {
    assert.equal(sanitizeRefCode('  abc_123  '), 'abc_123');
    assert.equal(sanitizeRefCode(123), '');
});

test('isValidRefCode accepts URL-safe ref codes and rejects invalid ones', () => {
    assert.equal(isValidRefCode('abc_123-XYZ'), true);
    assert.equal(isValidRefCode('bad code with spaces'), false);
    assert.equal(isValidRefCode(''), false);
});

test('resolveRefInput prioritizes query ref and allows body fallback', () => {
    assert.deepEqual(resolveRefInput({ queryRef: 'Q1', bodyRef: '' }), { error: null, ref: 'Q1' });
    assert.deepEqual(resolveRefInput({ queryRef: '', bodyRef: 'B1' }), { error: null, ref: 'B1' });
    assert.deepEqual(resolveRefInput({ queryRef: '', bodyRef: '' }), { error: null, ref: null });
});

test('resolveRefInput flags conflicting query and body refs', () => {
    assert.deepEqual(resolveRefInput({ queryRef: 'AAA', bodyRef: 'BBB' }), { error: 'REF_CONFLICT', ref: null });
});
