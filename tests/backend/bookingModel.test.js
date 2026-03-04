const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const Booking = require('../../models/Booking');

const newId = () => new mongoose.Types.ObjectId();

test('guest booking requires guestName and guestEmail and user=null', async () => {
    const doc = new Booking({
        slot: newId(),
        bookingType: 'guest',
        user: newId(),
        guestName: '',
        guestEmail: '',
    });

    await assert.rejects(
        doc.validate(),
        (err) => Boolean(err.errors.user && err.errors.guestName && err.errors.guestEmail)
    );
});

test('authenticated booking requires user and disallows guest fields', async () => {
    const doc = new Booking({
        slot: newId(),
        bookingType: 'authenticated',
        guestName: 'Test Guest',
        guestEmail: 'guest@example.com',
    });

    await assert.rejects(
        doc.validate(),
        (err) => Boolean(err.errors.user && err.errors.guestName && err.errors.guestEmail)
    );
});

test('valid authenticated booking passes schema validation', async () => {
    const doc = new Booking({
        slot: newId(),
        bookingType: 'authenticated',
        user: newId(),
    });

    await assert.doesNotReject(doc.validate());
});

test('valid guest booking passes schema validation', async () => {
    const doc = new Booking({
        slot: newId(),
        bookingType: 'guest',
        guestName: 'Jane Doe',
        guestEmail: 'jane@example.com',
    });

    await assert.doesNotReject(doc.validate());
});
