const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPublicSlotsQuery, isValidSlotWindow } = require('../../utils/slotVisibility');

test('buildPublicSlotsQuery always enforces isActive=true', () => {
    const now = new Date('2026-03-05T00:00:00.000Z');
    const query = buildPublicSlotsQuery(now);

    assert.equal(query.isActive, true);
    assert.ok(Array.isArray(query.$or));
    assert.ok(query.$or.length > 0);
});

test('isValidSlotWindow rejects invalid range when both start and end exist', () => {
    const start = new Date('2026-03-10T10:00:00.000Z');
    const end = new Date('2026-03-10T09:00:00.000Z');
    assert.equal(isValidSlotWindow({ startTime: start, endTime: end }), false);
});

test('isValidSlotWindow accepts legacy/no-end-time windows', () => {
    const start = new Date('2026-03-10T10:00:00.000Z');
    assert.equal(isValidSlotWindow({ startTime: start }), true);
    assert.equal(isValidSlotWindow({ date: start }), true);
});
